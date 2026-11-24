import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { env } from '@/config/env';
import { useNearbyGarages } from '@/features/garages/hooks/use-nearby-garages';
import { Coordinates } from '@/features/garages/types/garage.types';
import { useAuthStore } from '@/stores/use-auth-store';

import notificationsIconImg from '@assets/images/notifications-icon.png';
import searchIconImg from '@assets/images/search-icon.png';
import filterIconImg from '@assets/images/filter-icon.png';
import pinIconImg from '@assets/images/pin-icon.png';
import * as S from './home.styles';

const DEFAULT_COORDS: Coordinates = {
  latitude: -23.561414,
  longitude: -46.655881,
};

const SEARCH_RADIUS_METERS = 2000;
const DEBOUNCE_DELAY_MS = 2000;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);

  const mapRef = useRef<MapView | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreNextRegionChangeRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [searchCenter, setSearchCenter] = useState<Coordinates>(DEFAULT_COORDS);

  const { data: garages = [] } = useNearbyGarages(searchCenter, 2);

  const firstName = user?.name?.trim().split(' ')[0] || 'Motorista';

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
            latitudeDelta: 0.045,
            longitudeDelta: 0.045,
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
          results?: Array<{ geometry: { location: { lat: number; lng: number } } }>;
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

      setSearchCenter(targetCoords);
      ignoreNextRegionChangeRef.current = true;
      mapRef.current?.animateToRegion(
        {
          ...targetCoords,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045,
        },
        700
      );
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

    setSearchCenter(userLocation);
    ignoreNextRegionChangeRef.current = true;
    mapRef.current?.animateToRegion(
      {
        ...userLocation,
        latitudeDelta: 0.045,
        longitudeDelta: 0.045,
      },
      600
    );
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
        </S.SearchInputContainer>

        <S.IconSquareButton
          onPress={() => router.push('/coming-soon')}
          activeOpacity={0.75}
        >
          <S.HeaderIcon source={filterIconImg} resizeMode="contain" />
        </S.IconSquareButton>
      </S.SearchRow>

      <S.MapWrapper $bottomInset={insets.bottom}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          showsUserLocation
          showsMyLocationButton={false}
          initialRegion={{
            ...DEFAULT_COORDS,
            latitudeDelta: 0.045,
            longitudeDelta: 0.045,
          }}
          onRegionChange={handleRegionChangeStart}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          <Circle
            center={searchCenter}
            radius={SEARCH_RADIUS_METERS}
            strokeWidth={1.5}
            strokeColor="rgba(29, 78, 216, 0.55)"
            fillColor="rgba(59, 130, 246, 0.14)"
          />

          {garages.map((garage) => (
            <Marker
              key={garage.id}
              coordinate={{
                latitude: garage.latitude,
                longitude: garage.longitude,
              }}
              onPress={() => {
                router.push({
                  pathname: '/(main)/garage/[id]',
                  params: {
                    id: garage.id,
                    distanceInKm: String(garage.distanceInKm ?? 0),
                  },
                });
              }}
            >
              <S.PinImage source={pinIconImg} resizeMode="contain" />
            </Marker>
          ))}
        </MapView>

        {userLocation ? (
          <S.RecenterButton onPress={handleRecenterToUser} activeOpacity={0.8}>
            <S.RecenterText>Minha localização</S.RecenterText>
          </S.RecenterButton>
        ) : null}
      </S.MapWrapper>
    </S.Container>
  );
}