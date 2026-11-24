import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import {
  EnrichedBooking,
  useCancelBooking,
  useEnrichedBookings,
} from '@/features/bookings/hooks/use-bookings';
import { BookingStatus } from '@/features/bookings/types/booking.types';
import { useOpenBookingChat } from '@/features/chat/hooks/use-chat';

import backArrowIconImg from '@assets/images/back-arrow-icon.png';
import carBookingIconImg from '@assets/images/car-booking-icon.png';
import chatIconImg from '@assets/images/chat-icon.png';
import * as S from './bookings.styles';

type BookingFilterTab = 'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'ACTIVE';

const FILTER_TABS: Array<{ key: BookingFilterTab; label: string }> = [
  { key: 'ALL', label: 'Todas' },
  { key: 'IN_PROGRESS', label: 'Em andamento' },
  { key: 'COMPLETED', label: 'Concluidas' },
  { key: 'ACTIVE', label: 'Ativas' },
];

interface StatusPresentation {
  category: Exclude<BookingFilterTab, 'ALL'>;
  badgeLabel: string;
  badgeVariant: 'active' | 'soft';
  priceCaption: string;
}

function getStatusPresentation(status: BookingStatus): StatusPresentation {
  switch (status) {
    case 'CONFIRMED':
    case 'ACTIVE':
      // Reserva paga e pronta para estacionar
      return {
        category: 'ACTIVE',
        badgeLabel: 'Ativo',
        badgeVariant: 'active',
        priceCaption: 'Total pago',
      };

    case 'COMPLETED':
    case 'CANCELLED':
      // Reservas já feitas / finalizadas
      return {
        category: 'COMPLETED',
        badgeLabel: status === 'CANCELLED' ? 'Cancelado' : 'Concluído',
        badgeVariant: 'soft',
        priceCaption: 'Total pago',
      };

    case 'PENDING':
    case 'IN_PROGRESS':
    default:
      // Reservas aguardando pagamento
      return {
        category: 'IN_PROGRESS',
        badgeLabel: 'Em andamento',
        badgeVariant: 'soft',
        priceCaption: 'Total a ser pago',
      };
  }
}

function formatBookingSchedule(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Horário agendado';
  }

  const day = String(start.getDate()).padStart(2, '0');
  const month = String(start.getMonth() + 1).padStart(2, '0');
  const startHour = String(start.getHours()).padStart(2, '0');
  const startMin = String(start.getMinutes()).padStart(2, '0');
  const endHour = String(end.getHours()).padStart(2, '0');
  const endMin = String(end.getMinutes()).padStart(2, '0');

  return `${day}/${month} · ${startHour}:${startMin}–${endHour}:${endMin}`;
}

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [selectedTab, setSelectedTab] = useState<BookingFilterTab>('ALL');

  const {
    data: bookings = [],
    isLoading,
    isRefetching,
    refetch,
  } = useEnrichedBookings();
  const { mutateAsync: cancelBooking, isPending: isCancelling } =
    useCancelBooking();
  const { mutateAsync: openBookingChat } = useOpenBookingChat();

  const filteredBookings = useMemo(() => {
    const sorted = [...bookings].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (selectedTab === 'ALL') {
      return sorted;
    }

    return sorted.filter(
      (booking) => getStatusPresentation(booking.status).category === selectedTab
    );
  }, [bookings, selectedTab]);

  async function handleOpenChat(bookingId: string) {
    try {
      const room = await openBookingChat(bookingId);
      router.push({
        pathname: '/(main)/chat/[bookingId]',
        params: { bookingId: room.bookingId, roomId: room.roomId },
      });
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o chat desta reserva.');
    }
  }

  function confirmCancelBooking(bookingId: string) {
    Alert.alert(
      'Cancelar reserva',
      'Tem certeza que deseja cancelar esta reserva?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            void cancelBooking(bookingId)
              .then(() => refetch())
              .catch(() =>
                Alert.alert('Erro', 'Não foi possível cancelar a reserva.')
              );
          },
        },
      ]
    );
  }

  function renderBookingCard({ item }: { item: EnrichedBooking }) {
    const presentation = getStatusPresentation(item.status);
    const title =
      item.garage?.name ||
      item.garage?.address ||
      `Garagem #${item.garageId.slice(0, 8)}`;

    const schedule = formatBookingSchedule(
      item.startDateTime,
      item.endDateTime
    );

    const spotSubtitle =
      item.garage?.address ||
      (item.bookingType === 'DAILY' ? 'Diária · Vaga coberta' : 'Por hora · Vaga reservada');

    const canCancel =
      item.status === 'PENDING' || item.status === 'IN_PROGRESS';

    return (
      <S.BookingCard>
        <S.CardTopSection>
          <S.CardTopInfo>
            <S.GarageTitleText>{title}</S.GarageTitleText>
            <S.ScheduleText>{schedule}</S.ScheduleText>
          </S.CardTopInfo>

          <S.StatusBadge $variant={presentation.badgeVariant}>
            <S.StatusBadgeText $variant={presentation.badgeVariant}>
              {presentation.badgeLabel}
            </S.StatusBadgeText>
          </S.StatusBadge>
        </S.CardTopSection>

        <S.CardBottomSection>
          <S.CardDetailsRow>
            <S.LeftDetailsGroup>
              <S.CarIconBox>
                <S.CarBookingIcon
                  source={carBookingIconImg}
                  resizeMode="contain"
                />
              </S.CarIconBox>

              <S.SpotInfoColumn>
                <S.MutedCaption>Vaga reservada</S.MutedCaption>
                <S.SpotDetailValue>{spotSubtitle}</S.SpotDetailValue>
              </S.SpotInfoColumn>
            </S.LeftDetailsGroup>

            <S.PriceColumn>
              <S.MutedCaption>{presentation.priceCaption}</S.MutedCaption>
              <S.TotalAmountValue>R$ {item.totalAmount}</S.TotalAmountValue>
            </S.PriceColumn>
          </S.CardDetailsRow>

          <S.CardActionsRow>
            {canCancel ? (
              <S.CancelActionBtn
                disabled={isCancelling}
                onPress={() => confirmCancelBooking(item.bookingId)}
              >
                <S.CancelActionText>Cancelar</S.CancelActionText>
              </S.CancelActionBtn>
            ) : null}

            <S.ChatActionBtn
              onPress={() => {
                void handleOpenChat(item.bookingId);
              }}
            >
              <S.ChatActionIcon source={chatIconImg} resizeMode="contain" />
              <S.ChatActionText>Conversar com proprietário</S.ChatActionText>
            </S.ChatActionBtn>
          </S.CardActionsRow>
        </S.CardBottomSection>
      </S.BookingCard>
    );
  }

  return (
    <S.Container $topInset={insets.top}>
      <S.HeaderRow>
        <S.BackButton
          onPress={() => router.replace('/(main)/(tabs)')}
          activeOpacity={0.75}
        >
          <S.BackArrowIcon source={backArrowIconImg} resizeMode="contain" />
        </S.BackButton>

        <S.HeaderTitle>Reservas</S.HeaderTitle>
      </S.HeaderRow>

      <S.HeaderDivider />

      <S.FilterTabsScroll>
        {FILTER_TABS.map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <S.FilterTabPill
              key={tab.key}
              $active={isActive}
              onPress={() => setSelectedTab(tab.key)}
              activeOpacity={0.8}
            >
              <S.FilterTabText $active={isActive}>{tab.label}</S.FilterTabText>
            </S.FilterTabPill>
          );
        })}
      </S.FilterTabsScroll>

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size="large" color={theme.colors.blue[1000]} />
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.bookingId}
          renderItem={renderBookingCard}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                void refetch();
              }}
              tintColor={theme.colors.blue[1000]}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom, 16) + 100,
            gap: 14,
          }}
          ListEmptyComponent={
            <S.EmptyBox>
              <S.EmptyText>
                Nenhuma reserva encontrada nesta categoria.
              </S.EmptyText>
            </S.EmptyBox>
          }
        />
      )}
    </S.Container>
  );
}