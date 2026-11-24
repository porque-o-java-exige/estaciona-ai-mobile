import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { isAxiosError } from 'axios';

import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import {
  useGarageDetails,
  useGarageRating,
} from '@/features/garages/hooks/use-garage-details';
import {
  useCreateBooking,
  useMyVehicles,
} from '@/features/bookings/hooks/use-bookings';
import { BookingType } from '@/features/bookings/types/booking.types';
import { useOpenBookingChat } from '@/features/chat/hooks/use-chat';

import backArrowIconImg from '@assets/images/back-arrow-icon.png';
import ratingStarIconImg from '@assets/images/rating-star-icon.png';
import distanceIconImg from '@assets/images/distance-icon.png';
import chatIconImg from '@assets/images/chat-icon.png';
import bookingIconImg from '@assets/images/booking-icon.png';
import * as S from './garage-description.styles';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=900&q=80';

const FEATURE_LABELS: Record<string, string> = {
  COVERED: 'Coberto',
  SECURITY_CAMERA: 'Câmera de segurança',
  GATE_REMOTE: 'Portão eletrônico',
  EV_CHARGING: 'Ev Charging',
  ACCESS_24_7: '24/7 access',
  LIGHTING: 'Iluminação noturna',
};

function formatFeatureLabel(raw: string): string {
  const normalized = raw.trim().toUpperCase();
  return FEATURE_LABELS[normalized] ?? raw;
}

function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
  }
  return 'Não foi possível concluir a reserva agora. Verifique os dados e tente novamente.';
}

export default function GarageDescriptionScreen() {
  const { id, distanceInKm } = useLocalSearchParams<{
    id: string;
    distanceInKm?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const { data: garage, isLoading } = useGarageDetails(id);
  const { data: rating } = useGarageRating(id);
  const { data: vehicles = [] } = useMyVehicles();
  const { mutateAsync: createBooking, isPending: isCreatingBooking } =
    useCreateBooking();
  const { mutateAsync: openBookingChat, isPending: isOpeningChat } =
    useOpenBookingChat();

  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType>('HOURLY');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [durationUnits, setDurationUnits] = useState(2);

  useEffect(() => {
    if (!garage) return;
    if (garage.pricePerHour != null) {
      setSelectedBookingType('HOURLY');
    } else if (garage.pricePerDay != null) {
      setSelectedBookingType('DAILY');
    }
  }, [garage]);

  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      const firstId = vehicles[0].vehicleId ?? vehicles[0].id ?? '';
      if (firstId) setSelectedVehicleId(firstId);
    }
  }, [vehicles, selectedVehicleId]);

  const galleryImages = useMemo(() => {
    if (!garage) return [FALLBACK_IMAGE];
    const list: string[] = [];
    if (garage.coverImageUrl) list.push(garage.coverImageUrl);
    if (Array.isArray(garage.images)) {
      for (const img of garage.images) {
        if (img && img !== 'string' && !list.includes(img)) {
          list.push(img);
        }
      }
    }
    return list.length > 0 ? list : [FALLBACK_IMAGE];
  }, [garage]);

  const featuresList = useMemo(() => {
    if (!garage?.features?.length) {
      return ['Coberto', 'Câmera de segurança', 'Portão eletrônico'];
    }
    const valid = garage.features.filter((f) => f && f !== 'string');
    return valid.length > 0
      ? valid.map(formatFeatureLabel)
      : ['Coberto', 'Câmera de segurança', 'Portão eletrônico'];
  }, [garage]);

  if (isLoading || !garage) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.white[1100],
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.blue[1000]} />
      </View>
    );
  }

  const hasBothRates =
    garage.pricePerHour != null && garage.pricePerDay != null;

  const displayedPrice =
    selectedBookingType === 'DAILY'
      ? garage.pricePerDay ?? garage.price ?? 0
      : garage.pricePerHour ?? garage.price ?? 0;

  const priceUnitLabel = selectedBookingType === 'DAILY' ? '/Dia' : '/Hora';
  const averageRating = rating?.averageRating ?? 4.8;
  const totalReviews = rating?.totalReviews ?? 0;
  const formattedDistance = distanceInKm
    ? `${Number(distanceInKm).toFixed(1)} km`
    : '0.2 km';

  const ownerInitials = 'PR';

  function handleGalleryScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setActiveSlide(index);
  }

  async function handleConfirmReservation() {
    if (!garage) return;

    if (!selectedVehicleId.trim()) {
      Alert.alert(
        'Veículo obrigatório',
        'Selecione ou informe o ID de um veículo cadastrado para reservar.'
      );
      return;
    }

    const start = new Date(Date.now() + 15 * 60 * 1000);
    const end = new Date(
      start.getTime() +
        (selectedBookingType === 'HOURLY'
          ? durationUnits * 60 * 60 * 1000
          : durationUnits * 24 * 60 * 60 * 1000)
    );

    try {
      const booking = await createBooking({
        garageId: garage.garageId,
        vehicleId: selectedVehicleId.trim(),
        bookingType: selectedBookingType,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
      });

      await openBookingChat(booking.bookingId);

      setIsModalVisible(false);
      router.replace('/(main)/(tabs)/bookings');
    } catch (error) {
      Alert.alert('Não foi possível reservar', getApiErrorMessage(error));
    }
  }

  return (
    <S.Container>
      <S.ScrollContent>
        <S.HeroContainer>
          <FlatList
            data={galleryImages}
            keyExtractor={(item, idx) => `${item}-${idx}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleGalleryScroll}
            renderItem={({ item }) => (
              <S.HeroImage
                source={{ uri: item }}
                style={{ width: screenWidth }}
                resizeMode="cover"
              />
            )}
          />

          <S.BackButton
            $topInset={insets.top}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <S.BackArrowIcon source={backArrowIconImg} resizeMode="contain" />
          </S.BackButton>

          {galleryImages.length > 1 ? (
            <S.PaginationDots>
              {galleryImages.map((_, idx) => (
                <S.Dot key={idx} $active={idx === activeSlide} />
              ))}
            </S.PaginationDots>
          ) : null}

          <S.AvailabilityBadge $available={garage.available}>
            <S.AvailabilityText $available={garage.available}>
              {garage.available ? 'Vaga disponível' : 'Indisponível'}
            </S.AvailabilityText>
          </S.AvailabilityBadge>
        </S.HeroContainer>

        <S.ContentBody>
          <S.TitlePriceRow>
            <S.TitleColumn>
              <S.GarageName>{garage.name}</S.GarageName>
              <S.GarageAddress>{garage.address}</S.GarageAddress>
              {garage.description ? (
                <S.GarageDescriptionText>
                  {garage.description}
                </S.GarageDescriptionText>
              ) : null}
            </S.TitleColumn>

            <S.PriceBox>
              <S.PriceValue>R${displayedPrice}</S.PriceValue>
              <S.PriceUnit>{priceUnitLabel}</S.PriceUnit>
            </S.PriceBox>
          </S.TitlePriceRow>

          {hasBothRates ? (
            <S.RateToggleRow>
              <S.RateToggleChip
                $active={selectedBookingType === 'HOURLY'}
                onPress={() => setSelectedBookingType('HOURLY')}
              >
                <S.RateToggleText $active={selectedBookingType === 'HOURLY'}>
                  Por Hora (R${garage.pricePerHour}/h)
                </S.RateToggleText>
              </S.RateToggleChip>

              <S.RateToggleChip
                $active={selectedBookingType === 'DAILY'}
                onPress={() => setSelectedBookingType('DAILY')}
              >
                <S.RateToggleText $active={selectedBookingType === 'DAILY'}>
                  Por Dia (R${garage.pricePerDay}/dia)
                </S.RateToggleText>
              </S.RateToggleChip>
            </S.RateToggleRow>
          ) : null}

          <S.BadgesRow>
            <S.InfoPill>
              {[1, 2, 3, 4, 5].map((star) => (
                <S.StarIcon
                  key={star}
                  source={ratingStarIconImg}
                  $filled={star <= Math.round(averageRating)}
                  resizeMode="contain"
                />
              ))}
              <S.PillBoldText>{averageRating.toFixed(1)}</S.PillBoldText>
              <S.PillMutedText>({totalReviews})</S.PillMutedText>
            </S.InfoPill>

            <S.InfoPill>
              <S.DistanceIcon source={distanceIconImg} resizeMode="contain" />
              <S.PillBoldText>{formattedDistance}</S.PillBoldText>
            </S.InfoPill>
          </S.BadgesRow>

          <S.SectionTitle>Características da garagem</S.SectionTitle>

          <S.FeaturesGrid>
            {featuresList.map((feature, index) => (
              <S.FeatureChip key={`${feature}-${index}`}>
                <S.FeatureChipText>{feature}</S.FeatureChipText>
              </S.FeatureChip>
            ))}
          </S.FeaturesGrid>

          <S.OwnerCard>
            <S.OwnerLeft>
              <S.OwnerAvatar>
                <S.OwnerAvatarText>{ownerInitials}</S.OwnerAvatarText>
              </S.OwnerAvatar>
              <View style={{ flex: 1 }}>
                <S.OwnerName>Proprietário da vaga</S.OwnerName>
                <S.OwnerSubtitle>
                  Chat liberado automaticamente após reservar
                </S.OwnerSubtitle>
              </View>
            </S.OwnerLeft>

            <S.ChatButton
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.8}
            >
              <S.ChatButtonIcon source={chatIconImg} resizeMode="contain" />
              <S.ChatButtonText>Chat</S.ChatButtonText>
            </S.ChatButton>
          </S.OwnerCard>
        </S.ContentBody>
      </S.ScrollContent>

      <S.FooterBar $bottomInset={insets.bottom}>
        <Button
          title="Adicionar a reservas"
          disabled={!garage.available}
          onPress={() => setIsModalVisible(true)}
        />
      </S.FooterBar>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <S.ModalBackdrop>
          <S.ModalCard $bottomInset={insets.bottom}>
            <S.ModalTitle>Confirmar reserva</S.ModalTitle>
            <S.ModalSubtitle>
              A vaga será adicionada às suas reservas e uma sala de chat será
              criada com o proprietário.
            </S.ModalSubtitle>

            <S.FieldLabel>Veículo da reserva</S.FieldLabel>

            {vehicles.length > 0 ? (
              <S.VehicleChipRow>
                {vehicles.map((v) => {
                  const vId = v.vehicleId ?? v.id ?? '';
                  const isSelected = selectedVehicleId === vId;
                  return (
                    <S.VehicleChip
                      key={vId}
                      $selected={isSelected}
                      onPress={() => setSelectedVehicleId(vId)}
                    >
                      <S.VehicleChipText $selected={isSelected}>
                        {v.model} • {v.plate}
                      </S.VehicleChipText>
                    </S.VehicleChip>
                  );
                })}
              </S.VehicleChipRow>
            ) : (
              <Input
                label="ID do Veículo (UUID)"
                leftIcon={bookingIconImg}
                placeholder="Cole o vehicleId cadastrado no motorista"
                autoCapitalize="none"
                value={selectedVehicleId}
                onChangeText={setSelectedVehicleId}
              />
            )}

            <S.DurationRow>
              <S.FieldLabel>
                Duração ({selectedBookingType === 'DAILY' ? 'dias' : 'horas'})
              </S.FieldLabel>

              <S.StepperControls>
                <S.StepperBtn
                  onPress={() =>
                    setDurationUnits((prev) => Math.max(1, prev - 1))
                  }
                >
                  <S.StepperBtnText>-</S.StepperBtnText>
                </S.StepperBtn>

                <S.DurationValueText>
                  {durationUnits}{' '}
                  {selectedBookingType === 'DAILY'
                    ? durationUnits === 1
                      ? 'dia'
                      : 'dias'
                    : durationUnits === 1
                      ? 'hora'
                      : 'horas'}
                </S.DurationValueText>

                <S.StepperBtn
                  onPress={() => setDurationUnits((prev) => prev + 1)}
                >
                  <S.StepperBtnText>+</S.StepperBtnText>
                </S.StepperBtn>
              </S.StepperControls>
            </S.DurationRow>

            <S.ModalActionsRow>
              <View style={{ flex: 1 }}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={() => setIsModalVisible(false)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={`Reservar (R$${displayedPrice * durationUnits})`}
                  isLoading={isCreatingBooking || isOpeningChat}
                  onPress={() => {
                    void handleConfirmReservation();
                  }}
                />
              </View>
            </S.ModalActionsRow>
          </S.ModalCard>
        </S.ModalBackdrop>
      </Modal>
    </S.Container>
  );
}