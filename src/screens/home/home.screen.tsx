import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Platform,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import { Button } from '@/components/ui/button.component';
import { env } from '@/config/env';
import { useNearbyGarages } from '@/features/garages/hooks/use-nearby-garages';
import {
  Coordinates,
  GarageSearchFilters,
} from '@/features/garages/types/garage.types';
import { useAuthStore } from '@/stores/use-auth-store';

import notificationsIconImg from '@assets/images/notifications-icon.png';
import searchIconImg from '@assets/images/search-icon.png';
import filterIconImg from '@assets/images/filter-icon.png';
import pinIconImg from '@assets/images/pin-icon.png';
import ratingStarIconImg from '@assets/images/rating-star-icon.png';
import * as S from './home.styles';

const DEFAULT_COORDS: Coordinates = {
  latitude: -23.561414,
  longitude: -46.655881,
};

const DEFAULT_FILTERS: GarageSearchFilters = {
  nearMeOnly: true,
  maxPricePerHour: null,
  maxRadiusKm: 2,
};

const PRICE_OPTIONS: Array<{ label: string; value: number | null }> = [
  { label: 'Qualquer valor', value: null },
  { label: 'Até R$ 10/h', value: 10 },
  { label: 'Até R$ 15/h', value: 15 },
  { label: 'Até R$ 25/h', value: 25 },
  { label: 'Até R$ 40/h', value: 40 },
];

const RADIUS_OPTIONS: number[] = [0.5, 1, 2, 5];

const FALLBACK_GARAGE_THUMB =
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=400&q=80';

const DEBOUNCE_DELAY_MS = 2000;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);

  const mapRef = useRef<MapView | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreNextRegionChangeRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchedAddressLabel, setSearchedAddressLabel] = useState<
    string | null
  >(null);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [searchCenter, setSearchCenter] = useState<Coordinates>(DEFAULT_COORDS);

  const [filters, setFilters] = useState<GarageSearchFilters>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] =
    useState<GarageSearchFilters>(DEFAULT_FILTERS);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { data: rawGarages = [], isLoading: isLoadingGarages } =
    useNearbyGarages(searchCenter, filters.maxRadiusKm);

  const firstName = user?.name?.trim().split(' ')[0] || 'Motorista';

  const hasActiveCustomFilter =
    filters.maxPricePerHour !== null || filters.maxRadiusKm !== 2;

  const filteredGarages = useMemo(() => {
    const list = rawGarages.filter((garage) => {
      if (filters.maxPricePerHour !== null) {
        const effectiveHourly = garage.pricePerHour ?? garage.pricePerDay ?? 0;
        if (effectiveHourly > filters.maxPricePerHour) {
          return false;
        }
      }
      return true;
    });

    if (filters.nearMeOnly) {
      return [...list].sort(
        (a, b) => (a.distanceInKm ?? 0) - (b.distanceInKm ?? 0)
      );
    }

    return list;
  }, [rawGarages, filters]);

  useEffect(() => {
    let isMounted = true;

    async function loadUserLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isMounted) return;

        const coords: Coordinates = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };

        setUserLocation(coords);
        setSearchCenter(coords);

        ignoreNextRegionChangeRef.current = true;
        mapRef.current?.animateToRegion(
          {
            ...coords,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          },
          600
        );
      } catch {
        // Mantém coordenadas padrão caso o GPS esteja indisponível
      }
    }

    void loadUserLocation();

    return () => {
      isMounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  function moveMapToCoordinates(coords: Coordinates, radiusKm: number) {
    const delta = Math.max(0.025, radiusKm * 0.02);
    ignoreNextRegionChangeRef.current = true;
    mapRef.current?.animateToRegion(
      {
        ...coords,
        latitudeDelta: delta,
        longitudeDelta: delta,
      },
      700
    );
  }

  function handleRegionChangeStart() {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }

  function handleRegionChangeComplete(region: Region) {
    if (ignoreNextRegionChangeRef.current) {
      ignoreNextRegionChangeRef.current = false;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setSearchCenter({
        latitude: region.latitude,
        longitude: region.longitude,
      });
    }, DEBOUNCE_DELAY_MS);
  }

  async function handleSearchAddress() {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setIsSearchingAddress(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    try {
      let targetCoords: Coordinates | null = null;

      const deviceResults = await Location.geocodeAsync(trimmed);
      if (deviceResults.length > 0) {
        targetCoords = {
          latitude: deviceResults[0].latitude,
          longitude: deviceResults[0].longitude,
        };
      } else if (env.googleMapsApiKey) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            trimmed
          )}&key=${env.googleMapsApiKey}`
        );
        const json = (await response.json()) as {
          results?: Array<{
            geometry: { location: { lat: number; lng: number } };
          }>;
        };
        const first = json.results?.[0]?.geometry.location;
        if (first) {
          targetCoords = { latitude: first.lat, longitude: first.lng };
        }
      }

      if (!targetCoords) {
        Alert.alert(
          'Endereço não encontrado',
          'Não foi possível localizar esse endereço ou bairro.'
        );
        return;
      }

      setSearchedAddressLabel(trimmed);
      setSearchCenter(targetCoords);
      moveMapToCoordinates(targetCoords, filters.maxRadiusKm);
    } catch {
      Alert.alert(
        'Erro na busca',
        'Não foi possível buscar o endereço agora. Tente novamente.'
      );
    } finally {
      setIsSearchingAddress(false);
    }
  }

  function handleRecenterToUser() {
    if (!userLocation) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSearchedAddressLabel(null);
    setSearchCenter(userLocation);
    moveMapToCoordinates(userLocation, filters.maxRadiusKm);
  }

  function handleOpenFilters() {
    setDraftFilters(filters);
    setIsFilterModalVisible(true);
  }

  function handleApplyFilters() {
    setFilters(draftFilters);
    setIsFilterModalVisible(false);

    if (draftFilters.nearMeOnly && userLocation && !searchedAddressLabel) {
      setSearchCenter(userLocation);
      moveMapToCoordinates(userLocation, draftFilters.maxRadiusKm);
    } else {
      moveMapToCoordinates(searchCenter, draftFilters.maxRadiusKm);
    }
  }

  function handleResetFilters() {
    setDraftFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setIsFilterModalVisible(false);
    moveMapToCoordinates(searchCenter, DEFAULT_FILTERS.maxRadiusKm);
  }

  function navigateToGarage(garageId: string, distanceInKm: number) {
    router.push({
      pathname: '/(main)/garage/[id]',
      params: {
        id: garageId,
        distanceInKm: String(distanceInKm ?? 0),
      },
    });
  }

  return (
    <S.Container $topInset={insets.top}>
      <S.HeaderRow>
        <S.GreetingWrapper>
          <S.GreetingText>Olá {firstName}!</S.GreetingText>
          <S.HeaderTitle>Onde vai estacionar hoje ?</S.HeaderTitle>
        </S.GreetingWrapper>

        <S.IconSquareButton
          onPress={() => router.push('/coming-soon')}
          activeOpacity={0.75}
        >
          <S.HeaderIcon source={notificationsIconImg} resizeMode="contain" />
        </S.IconSquareButton>
      </S.HeaderRow>

      <S.SearchRow>
        <S.SearchInputContainer>
          <S.SearchIcon source={searchIconImg} resizeMode="contain" />
          <S.SearchTextInput
            placeholder="Buscar endereço, bairro..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            editable={!isSearchingAddress}
            onSubmitEditing={() => {
              void handleSearchAddress();
            }}
          />
          {searchQuery.length > 0 ? (
            <S.ClearSearchButton
              onPress={() => {
                setSearchQuery('');
                setSearchedAddressLabel(null);
              }}
            >
              <S.ClearSearchText>✕</S.ClearSearchText>
            </S.ClearSearchButton>
          ) : null}
        </S.SearchInputContainer>

        <S.IconSquareButton
          $active={hasActiveCustomFilter}
          onPress={handleOpenFilters}
          activeOpacity={0.75}
        >
          <S.HeaderIcon source={filterIconImg} resizeMode="contain" />
          {hasActiveCustomFilter ? <S.FilterBadgeDot /> : null}
        </S.IconSquareButton>
      </S.SearchRow>

      <S.MainScroll $bottomInset={insets.bottom}>
        <S.MapWrapper>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={{
              ...DEFAULT_COORDS,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
            onRegionChange={handleRegionChangeStart}
            onRegionChangeComplete={handleRegionChangeComplete}
          >
            <Circle
              center={searchCenter}
              radius={filters.maxRadiusKm * 1000}
              strokeWidth={1.5}
              strokeColor="rgba(29, 78, 216, 0.55)"
              fillColor="rgba(59, 130, 246, 0.14)"
            />

            {filteredGarages.map((garage) => (
              <Marker
                key={garage.id}
                coordinate={{
                  latitude: garage.latitude,
                  longitude: garage.longitude,
                }}
                onPress={() =>
                  navigateToGarage(garage.id, garage.distanceInKm ?? 0)
                }
              >
                <S.PinImage source={pinIconImg} resizeMode="contain" />
              </Marker>
            ))}
          </MapView>

          {userLocation ? (
            <S.RecenterButton
              onPress={handleRecenterToUser}
              activeOpacity={0.8}
            >
              <S.RecenterText>Minha localização</S.RecenterText>
            </S.RecenterButton>
          ) : null}
        </S.MapWrapper>

        <S.ResultsSectionHeader>
          <S.ResultsSectionTitle>
            Vagas mais próximas de acordo com seu endereço
          </S.ResultsSectionTitle>
          <S.ResultsCountText>
            {filteredGarages.length}{' '}
            {filteredGarages.length === 1 ? 'vaga' : 'vagas'}
          </S.ResultsCountText>
        </S.ResultsSectionHeader>

        {isLoadingGarages || isSearchingAddress ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator size="small" color={theme.colors.blue[1000]} />
          </View>
        ) : filteredGarages.length === 0 ? (
          <S.EmptyResultsBox>
            <S.EmptyResultsText>
              Nenhuma garagem encontrada neste raio ou faixa de preço. Tente
              aumentar o raio de busca no filtro.
            </S.EmptyResultsText>
          </S.EmptyResultsBox>
        ) : (
          <S.GarageCardsList>
            {filteredGarages.map((garage) => {
              const priceLabel =
                garage.pricePerHour != null
                  ? `R$${garage.pricePerHour}/h`
                  : garage.pricePerDay != null
                    ? `R$${garage.pricePerDay}/dia`
                    : 'Consultar';

              const distanceLabel = `${(garage.distanceInKm ?? 0).toFixed(1)} km`;
              const ratingLabel = (garage.averageRating ?? 4.8).toFixed(1);
              const spotsText = !garage.available
                ? 'Indisponível'
                : garage.availableSpots != null
                  ? `${garage.availableSpots} ${garage.availableSpots === 1 ? 'vaga' : 'vagas'}`
                  : 'Disponível';

              return (
                <S.GarageCard
                  key={garage.id}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigateToGarage(garage.id, garage.distanceInKm ?? 0)
                  }
                >
                  <S.GarageCardThumb
                    source={{
                      uri: garage.coverImageUrl || FALLBACK_GARAGE_THUMB,
                    }}
                    resizeMode="cover"
                  />

                  <S.GarageCardBody>
                    <S.GarageCardTopRow>
                      <S.GarageCardTitle>{garage.name}</S.GarageCardTitle>
                      <S.SpotsBadge $available={garage.available}>
                        <S.SpotsBadgeText $available={garage.available}>
                          {spotsText}
                        </S.SpotsBadgeText>
                      </S.SpotsBadge>
                    </S.GarageCardTopRow>

                    <S.GarageCardAddress>{garage.address}</S.GarageCardAddress>

                    <S.GarageCardBottomRow>
                      <S.GarageMetaRow>
                        <S.MiniStarIcon
                          source={ratingStarIconImg}
                          resizeMode="contain"
                        />
                        <S.GarageMetaBold>{ratingLabel}</S.GarageMetaBold>
                        <S.GarageMetaMuted>
                          • {distanceLabel}
                          {garage.description ? ` • ${garage.description}` : ''}
                        </S.GarageMetaMuted>
                      </S.GarageMetaRow>

                      <S.GarageCardPrice>{priceLabel}</S.GarageCardPrice>
                    </S.GarageCardBottomRow>
                  </S.GarageCardBody>
                </S.GarageCard>
              );
            })}
          </S.GarageCardsList>
        )}
      </S.MainScroll>

      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <S.FilterBackdrop>
          <S.FilterSheet $bottomInset={insets.bottom}>
            <S.FilterHeader>
              <S.FilterTitle>Filtrar vagas</S.FilterTitle>
              <S.ResetFilterText onPress={handleResetFilters}>
                Limpar filtros
              </S.ResetFilterText>
            </S.FilterHeader>

            <S.FilterSectionLabel>Ordenação e proximidade</S.FilterSectionLabel>
            <S.FilterChipsRow>
              <S.FilterChip
                $selected={draftFilters.nearMeOnly}
                onPress={() =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    nearMeOnly: !prev.nearMeOnly,
                  }))
                }
              >
                <S.FilterChipText $selected={draftFilters.nearMeOnly}>
                  Perto de mim (mais próximas primeiro)
                </S.FilterChipText>
              </S.FilterChip>
            </S.FilterChipsRow>

            <S.FilterSectionLabel>Valor máximo por hora</S.FilterSectionLabel>
            <S.FilterChipsRow>
              {PRICE_OPTIONS.map((option) => {
                const isSelected =
                  draftFilters.maxPricePerHour === option.value;
                return (
                  <S.FilterChip
                    key={option.label}
                    $selected={isSelected}
                    onPress={() =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        maxPricePerHour: option.value,
                      }))
                    }
                  >
                    <S.FilterChipText $selected={isSelected}>
                      {option.label}
                    </S.FilterChipText>
                  </S.FilterChip>
                );
              })}
            </S.FilterChipsRow>

            <S.FilterSectionLabel>
              Raio máximo de busca (padrão 2 km)
            </S.FilterSectionLabel>
            <S.FilterChipsRow>
              {RADIUS_OPTIONS.map((radius) => {
                const isSelected = draftFilters.maxRadiusKm === radius;
                return (
                  <S.FilterChip
                    key={radius}
                    $selected={isSelected}
                    onPress={() =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        maxRadiusKm: radius,
                      }))
                    }
                  >
                    <S.FilterChipText $selected={isSelected}>
                      {radius} km
                    </S.FilterChipText>
                  </S.FilterChip>
                );
              })}
            </S.FilterChipsRow>

            <S.FilterActionsRow>
              <View style={{ flex: 1 }}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={() => setIsFilterModalVisible(false)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Aplicar filtros" onPress={handleApplyFilters} />
              </View>
            </S.FilterActionsRow>
          </S.FilterSheet>
        </S.FilterBackdrop>
      </Modal>
    </S.Container>
  );
}