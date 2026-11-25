import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { isAxiosError } from 'axios';

import { Button } from '@/components/ui/button.component';
import {
  useGarageDetails,
  useGarageRating,
} from '@/features/garages/hooks/use-garage-details';
import {
  useCreateBooking,
  useCreateVehicle,
  useMyVehicles,
} from '@/features/bookings/hooks/use-bookings';
import { BookingType } from '@/features/bookings/types/booking.types';
import { useOpenBookingChat } from '@/features/chat/hooks/use-chat';

import backArrowIconImg from '@assets/images/back-arrow-icon.png';
import ratingStarIconImg from '@assets/images/rating-star-icon.png';
import distanceIconImg from '@assets/images/distance-icon.png';
import chatIconImg from '@assets/images/chat-icon.png';
import * as S from './garage-description.styles';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=900&q=80';

const WEEK_DAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

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

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
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
  const { mutateAsync: createVehicle, isPending: isCreatingVehicle } =
    useCreateVehicle();
  const { mutateAsync: createBooking, isPending: isCreatingBooking } =
    useCreateBooking();
  const { mutateAsync: openBookingChat, isPending: isOpeningChat } =
    useOpenBookingChat();

  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedBookingType, setSelectedBookingType] =
    useState<BookingType>('HOURLY');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [quickModel, setQuickModel] = useState('');
  const [quickPlate, setQuickPlate] = useState('');
  const [hourlyUnits, setHourlyUnits] = useState(2);

  // Estado do calendário mensal (para reservas DAILY)
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const todayKey = useMemo(() => toDateKey(today), [today]);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDateKeys, setSelectedDateKeys] = useState<string[]>([
    todayKey,
  ]);

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

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstWeekDay = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const slots: Array<{ key: string; day: number; date: Date } | null> = [];
    for (let i = 0; i < firstWeekDay; i++) {
      slots.push(null);
    }
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const date = new Date(year, month, d);
      slots.push({ key: toDateKey(date), day: d, date });
    }
    return slots;
  }, [calendarMonth]);

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

  const effectiveUnits =
    selectedBookingType === 'DAILY'
      ? Math.max(1, selectedDateKeys.length)
      : hourlyUnits;

  const totalReservationAmount = displayedPrice * effectiveUnits;
  const priceUnitLabel = selectedBookingType === 'DAILY' ? '/Dia' : '/Hora';
  const averageRating = rating?.averageRating ?? 4.8;
  const totalReviews = rating?.totalReviews ?? 0;
  const formattedDistance = distanceInKm
    ? `${Number(distanceInKm).toFixed(1)} km`
    : '0.2 km';

  const monthLabel = calendarMonth.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  function toggleCalendarDay(key: string) {
    setSelectedDateKeys((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== key);
      }
      return [...prev, key].sort();
    });
  }

  function handleGalleryScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setActiveSlide(index);
  }

  async function handleQuickAddVehicle() {
    if (!quickModel.trim() || !quickPlate.trim()) {
      Alert.alert(
        'Dados incompletos',
        'Informe o modelo e a placa do seu veículo.'
      );
      return;
    }

    try {
      const created = await createVehicle({
        model: quickModel.trim(),
        plate: quickPlate.trim().toUpperCase(),
      });
      const createdId = created.vehicleId ?? created.id ?? '';
      if (createdId) {
        setSelectedVehicleId(createdId);
      }
      setQuickModel('');
      setQuickPlate('');
    } catch (error) {
      Alert.alert('Erro ao cadastrar veículo', getApiErrorMessage(error));
    }
  }

  async function handleConfirmReservation() {
    if (!garage) return;

    if (!selectedVehicleId) {
      Alert.alert(
        'Selecione um veículo',
        'Escolha ou cadastre um veículo acima antes de confirmar a reserva.'
      );
      return;
    }

    let start: Date;
    let end: Date;

    if (selectedBookingType === 'DAILY') {
      const sortedKeys = [...selectedDateKeys].sort();
      const firstDay = parseDateKey(sortedKeys[0]);
      const lastDay = parseDateKey(sortedKeys[sortedKeys.length - 1]);

      start = new Date(
        firstDay.getFullYear(),
        firstDay.getMonth(),
        firstDay.getDate(),
        8,
        0,
        0
      );
      if (start.getTime() <= Date.now()) {
        start = new Date(Date.now() + 15 * 60 * 1000);
      }
      end = new Date(
        lastDay.getFullYear(),
        lastDay.getMonth(),
        lastDay.getDate(),
        20,
        0,
        0
      );
      if (end.getTime() <= start.getTime()) {
        end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      }
    } else {
      start = new Date(Date.now() + 15 * 60 * 1000);
      end = new Date(start.getTime() + hourlyUnits * 60 * 60 * 1000);
    }

    try {
      const booking = await createBooking({
        garageId: garage.garageId,
        vehicleId: selectedVehicleId,
        bookingType: selectedBookingType,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
      });

      await openBookingChat(booking.bookingId);

      setIsModalVisible(false);
      router.replace({
        pathname: '/(main)/(tabs)/payment',
        params: { bookingId: booking.bookingId },
      });
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
                <S.OwnerAvatarText>PR</S.OwnerAvatarText>
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
            <ScrollView showsVerticalScrollIndicator={false}>
              <S.ModalTitle>Confirmar reserva</S.ModalTitle>
              <S.ModalSubtitle>
                Selecione seu veículo e a data para seguir para o pagamento.
              </S.ModalSubtitle>

              <S.FieldLabel>Selecione seu veículo</S.FieldLabel>

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
                <S.EmptyVehicleCard>
                  <S.ModalSubtitle style={{ marginBottom: 4 }}>
                    Nenhum veículo cadastrado. Cadastre agora para reservar:
                  </S.ModalSubtitle>
                  <S.QuickVehicleRow>
                    <S.QuickVehicleInput
                      placeholder="Modelo (ex: Onix)"
                      placeholderTextColor="#94A3B8"
                      value={quickModel}
                      onChangeText={setQuickModel}
                    />
                    <S.QuickVehicleInput
                      placeholder="Placa (ABC1D23)"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="characters"
                      value={quickPlate}
                      onChangeText={setQuickPlate}
                    />
                  </S.QuickVehicleRow>
                  <Button
                    title="Salvar veículo"
                    isLoading={isCreatingVehicle}
                    onPress={() => {
                      void handleQuickAddVehicle();
                    }}
                  />
                </S.EmptyVehicleCard>
              )}

              {selectedBookingType === 'DAILY' ? (
                <>
                  <S.FieldLabel>
                    Escolha os dias disponíveis ({selectedDateKeys.length}{' '}
                    {selectedDateKeys.length === 1
                      ? 'dia selecionado'
                      : 'dias selecionados'}
                    )
                  </S.FieldLabel>

                  <S.CalendarBox>
                    <S.CalendarHeaderRow>
                      <S.CalendarMonthTitle>{monthLabel}</S.CalendarMonthTitle>
                      <S.CalendarNavGroup>
                        <S.CalendarNavBtn
                          onPress={() =>
                            setCalendarMonth(
                              (prev) =>
                                new Date(
                                  prev.getFullYear(),
                                  prev.getMonth() - 1,
                                  1
                                )
                            )
                          }
                        >
                          <S.CalendarNavText>{'<'}</S.CalendarNavText>
                        </S.CalendarNavBtn>
                        <S.CalendarNavBtn
                          onPress={() =>
                            setCalendarMonth(
                              (prev) =>
                                new Date(
                                  prev.getFullYear(),
                                  prev.getMonth() + 1,
                                  1
                                )
                            )
                          }
                        >
                          <S.CalendarNavText>{'>'}</S.CalendarNavText>
                        </S.CalendarNavBtn>
                      </S.CalendarNavGroup>
                    </S.CalendarHeaderRow>

                    <S.WeekDaysRow>
                      {WEEK_DAYS.map((dayName) => (
                        <S.WeekDayText key={dayName}>{dayName}</S.WeekDayText>
                      ))}
                    </S.WeekDaysRow>

                    <S.DaysGrid>
                      {calendarDays.map((slot, idx) => {
                        if (!slot) {
                          return <S.DayCellSlot key={`empty-${idx}`} />;
                        }

                        const isPast = slot.date.getTime() < today.getTime();
                        const isSelected = selectedDateKeys.includes(slot.key);
                        const isToday = slot.key === todayKey;

                        return (
                          <S.DayCellSlot key={slot.key}>
                            <S.DayCircleBtn
                              disabled={isPast}
                              $disabled={isPast}
                              $selected={isSelected}
                              $isToday={isToday}
                              onPress={() => toggleCalendarDay(slot.key)}
                            >
                              <S.DayNumberText
                                $selected={isSelected}
                                $disabled={isPast}
                              >
                                {slot.day}
                              </S.DayNumberText>
                            </S.DayCircleBtn>
                          </S.DayCellSlot>
                        );
                      })}
                    </S.DaysGrid>
                  </S.CalendarBox>
                </>
              ) : (
                <S.DurationRow>
                  <S.FieldLabel>Duração (horas)</S.FieldLabel>

                  <S.StepperControls>
                    <S.StepperBtn
                      onPress={() =>
                        setHourlyUnits((prev) => Math.max(1, prev - 1))
                      }
                    >
                      <S.StepperBtnText>-</S.StepperBtnText>
                    </S.StepperBtn>

                    <S.DurationValueText>
                      {hourlyUnits} {hourlyUnits === 1 ? 'hora' : 'horas'}
                    </S.DurationValueText>

                    <S.StepperBtn
                      onPress={() => setHourlyUnits((prev) => prev + 1)}
                    >
                      <S.StepperBtnText>+</S.StepperBtnText>
                    </S.StepperBtn>
                  </S.StepperControls>
                </S.DurationRow>
              )}

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
                    title={`Reservar (R$${totalReservationAmount})`}
                    isLoading={isCreatingBooking || isOpeningChat}
                    onPress={() => {
                      void handleConfirmReservation();
                    }}
                  />
                </View>
              </S.ModalActionsRow>
            </ScrollView>
          </S.ModalCard>
        </S.ModalBackdrop>
      </Modal>
    </S.Container>
  );
}