import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { isAxiosError } from 'axios';

import {
  EnrichedBooking,
  useEnrichedBookings,
} from '@/features/bookings/hooks/use-bookings';
import {
  useCreatePayment,
  useSimulatePaymentApproval,
} from '@/features/payments/hooks/use-payments';
import { useAuthStore } from '@/stores/use-auth-store';

import backArrowIconImg from '@assets/images/back-arrow-icon.png';
import checkIconImg from '@assets/images/check-icon.png';
import * as S from './payment.styles';

type SelectedPaymentOption = 'PIX' | 'SIMULATE';

const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=400&q=80';

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
  }
  return 'Não foi possível processar o pagamento agora.';
}

export default function PaymentScreen() {
  const { bookingId: preselectedBookingId } = useLocalSearchParams<{
    bookingId?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);

  const { data: bookings = [], isLoading } = useEnrichedBookings();
  const { mutateAsync: createPayment, isPending: isCreatingPayment } =
    useCreatePayment();
  const { mutateAsync: simulateApproval, isPending: isSimulating } =
    useSimulatePaymentApproval();

  const pendingBookings = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === 'PENDING' || b.status === 'IN_PROGRESS'
      ),
    [bookings]
  );

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [selectedOption, setSelectedOption] =
    useState<SelectedPaymentOption>('SIMULATE');
  const [payerCpf, setPayerCpf] = useState('19102830005');

  useEffect(() => {
    if (preselectedBookingId) {
      setSelectedBookingId(preselectedBookingId);
      return;
    }
    if (!selectedBookingId && pendingBookings.length > 0) {
      setSelectedBookingId(pendingBookings[0].bookingId);
    }
  }, [preselectedBookingId, pendingBookings, selectedBookingId]);

  const selectedBooking: EnrichedBooking | undefined = useMemo(
    () =>
      pendingBookings.find((b) => b.bookingId === selectedBookingId) ??
      pendingBookings[0],
    [pendingBookings, selectedBookingId]
  );

  const isBusy = isCreatingPayment || isSimulating;
  const subtotal = selectedBooking?.totalAmount ?? 0;
  const serviceFee = 0;
  const discount = 0;
  const finalTotal = subtotal + serviceFee - discount;

  async function handleProceedPayment() {
    if (!selectedBooking) {
      Alert.alert(
        'Selecione uma reserva',
        'Escolha uma reserva pendente para pagar.'
      );
      return;
    }

    const cleanCpf = payerCpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      Alert.alert('CPF inválido', 'Informe um CPF válido com 11 dígitos.');
      return;
    }

    const email = user?.email || 'motorista@estacionaai.com';

    try {
      const payment = await createPayment({
        bookingId: selectedBooking.bookingId,
        paymentMethod: 'PIX',
        payerEmail: email,
        payerCpf: cleanCpf,
      });

      if (selectedOption === 'SIMULATE') {
        await simulateApproval(payment.id);
        Alert.alert(
          'Pagamento confirmado!',
          'Sua reserva foi confirmada e o proprietário da garagem foi notificado.',
          [
            {
              text: 'Ver minhas reservas',
              onPress: () => router.replace('/(main)/(tabs)/bookings'),
            },
          ]
        );
      } else {
        router.push({
          pathname: '/(main)/payment/pix',
          params: {
            paymentId: payment.id,
            bookingId: payment.bookingId,
            totalAmount: String(payment.totalAmount),
            qrCode: payment.qrCode,
            qrCodeBase64: payment.qrCodeBase64 ?? '',
          },
        });
      }
    } catch (error) {
      Alert.alert('Erro no pagamento', getErrorMessage(error));
    }
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
        <S.HeaderTitle>Pagamento</S.HeaderTitle>
      </S.HeaderRow>

      <S.HeaderDivider />

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size="large" color={theme.colors.blue[1000]} />
        </View>
      ) : (
        <>
          <S.ScrollBody $bottomInset={insets.bottom}>
            <S.PendingBookingsList>
              {pendingBookings.length === 0 ? (
                <S.SummaryCard>
                  <S.SummaryTitle>Nenhuma reserva pendente</S.SummaryTitle>
                  <S.SummaryBlueLabel>
                    Todas as suas reservas já foram pagas ou você ainda não
                    adicionou uma vaga.
                  </S.SummaryBlueLabel>
                </S.SummaryCard>
              ) : (
                pendingBookings.map((item) => {
                  const isChecked =
                    selectedBooking?.bookingId === item.bookingId;
                  const title =
                    item.garage?.name ||
                    `Garagem #${item.garageId.slice(0, 8)}`;
                  const address =
                    item.garage?.address || 'Endereço da garagem reservada';

                  return (
                    <S.BookingSelectCard
                      key={item.bookingId}
                      $selected={isChecked}
                      activeOpacity={0.85}
                      onPress={() => setSelectedBookingId(item.bookingId)}
                    >
                      <S.BookingThumb
                        source={{
                          uri: item.garage?.coverImageUrl || FALLBACK_THUMB,
                        }}
                        resizeMode="cover"
                      />

                      <S.BookingInfoColumn>
                        <S.BookingName>{title}</S.BookingName>
                        <S.BookingAddress>{address}</S.BookingAddress>
                        <S.BookingMetaRow>
                          <S.BookingMetaText>
                            {item.bookingType === 'DAILY' ? 'Diária' : 'Hora'}
                          </S.BookingMetaText>
                          <S.BookingMetaText>
                            R$ {item.totalAmount.toFixed(2).replace('.', ',')}
                          </S.BookingMetaText>
                        </S.BookingMetaRow>
                      </S.BookingInfoColumn>

                      <S.CheckboxBox $checked={isChecked}>
                        {isChecked ? (
                          <S.CheckIconImage
                            source={checkIconImg}
                            resizeMode="contain"
                          />
                        ) : null}
                      </S.CheckboxBox>
                    </S.BookingSelectCard>
                  );
                })
              )}
            </S.PendingBookingsList>

            {selectedBooking ? (
              <>
                <S.SummaryCard>
                  <S.SummaryTitle>Resumo da reserva</S.SummaryTitle>

                  <S.SummaryRow>
                    <S.SummaryBlueLabel>
                      {selectedBooking.bookingType === 'DAILY'
                        ? 'Dias escolhidos'
                        : 'Horas escolhidas'}
                    </S.SummaryBlueLabel>
                    <S.SummaryBlueValue>
                      R$ {subtotal.toFixed(2).replace('.', ',')}
                    </S.SummaryBlueValue>
                  </S.SummaryRow>

                  <S.SummaryRow>
                    <S.SummaryBlueLabel>Taxa de Serviço</S.SummaryBlueLabel>
                    <S.SummaryBlueValue>R$ 0,00</S.SummaryBlueValue>
                  </S.SummaryRow>

                  <S.SummaryRow>
                    <S.SummaryBlueLabel>Desconto</S.SummaryBlueLabel>
                    <S.SummaryGreenValue>- R$ 0,00</S.SummaryGreenValue>
                  </S.SummaryRow>

                  <S.SummaryDivider />

                  <S.SummaryRow>
                    <S.TotalLabel>Total</S.TotalLabel>
                    <S.TotalValue>
                      R$ {finalTotal.toFixed(2).replace('.', ',')}
                    </S.TotalValue>
                  </S.SummaryRow>
                </S.SummaryCard>

                <S.MethodsSectionCard>
                  <S.MethodsTitle>Formas de pagamento</S.MethodsTitle>

                  <S.MethodOptionCard
                    $selected={selectedOption === 'PIX'}
                    onPress={() => setSelectedOption('PIX')}
                    activeOpacity={0.85}
                  >
                    <S.MethodLeft>
                      <S.MethodBadgeIcon $bg="#2DD4BF">
                        <S.MethodBadgeSymbol>❖</S.MethodBadgeSymbol>
                      </S.MethodBadgeIcon>
                      <View>
                        <S.MethodTitle>Pix</S.MethodTitle>
                        <S.MethodSubtitle>
                          Gerar QR Code e Copia e Cola
                        </S.MethodSubtitle>
                      </View>
                    </S.MethodLeft>
                    <S.RadioOuter $selected={selectedOption === 'PIX'}>
                      {selectedOption === 'PIX' ? <S.RadioInner /> : null}
                    </S.RadioOuter>
                  </S.MethodOptionCard>

                  <S.MethodOptionCard
                    $selected={selectedOption === 'SIMULATE'}
                    onPress={() => setSelectedOption('SIMULATE')}
                    activeOpacity={0.85}
                  >
                    <S.MethodLeft>
                      <S.MethodBadgeIcon $bg="#1E5BB7">
                        <S.MethodBadgeSymbol>✓</S.MethodBadgeSymbol>
                      </S.MethodBadgeIcon>
                      <View style={{ flex: 1 }}>
                        <S.MethodTitle>Simular Pagamento</S.MethodTitle>
                        <S.MethodSubtitle>
                          Aprovar na hora e confirmar vaga
                        </S.MethodSubtitle>
                      </View>
                    </S.MethodLeft>
                    <S.RadioOuter $selected={selectedOption === 'SIMULATE'}>
                      {selectedOption === 'SIMULATE' ? <S.RadioInner /> : null}
                    </S.RadioOuter>
                  </S.MethodOptionCard>

                  <S.CpfBox>
                    <S.CpfLabel>CPF do Pagador (obrigatório no Pix)</S.CpfLabel>
                    <S.CpfInput
                      value={payerCpf}
                      onChangeText={setPayerCpf}
                      keyboardType="numeric"
                      maxLength={14}
                      placeholder="000.000.000-00"
                      placeholderTextColor="#94A3B8"
                    />
                  </S.CpfBox>
                </S.MethodsSectionCard>
              </>
            ) : null}
          </S.ScrollBody>

          {selectedBooking ? (
            <S.BottomPayBar $bottomInset={insets.bottom}>
              <S.PayBlackButton
                disabled={isBusy}
                $disabled={isBusy}
                activeOpacity={0.85}
                onPress={() => {
                  void handleProceedPayment();
                }}
              >
                {isBusy ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <S.PayBlackButtonText>
                    {selectedOption === 'SIMULATE'
                      ? `Simular Pagamento R$${finalTotal.toFixed(2).replace('.', ',')}`
                      : `Pagar R$${finalTotal.toFixed(2).replace('.', ',')}`}
                  </S.PayBlackButtonText>
                )}
              </S.PayBlackButton>
            </S.BottomPayBar>
          ) : null}
        </>
      )}
    </S.Container>
  );
}