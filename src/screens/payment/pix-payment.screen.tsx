import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import * as Clipboard from 'expo-clipboard';

import { Button } from '@/components/ui/button.component';
import { useSimulatePaymentApproval } from '@/features/payments/hooks/use-payments';

import backArrowIconImg from '@assets/images/back-arrow-icon.png';

export default function PixPaymentScreen() {
  const { paymentId, totalAmount, qrCode, qrCodeBase64 } =
    useLocalSearchParams<{
      paymentId: string;
      bookingId: string;
      totalAmount: string;
      qrCode: string;
      qrCodeBase64?: string;
    }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const { mutateAsync: simulateApproval, isPending: isSimulating } =
    useSimulatePaymentApproval();

  const [secondsLeft, setSecondsLeft] = useState(600);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const progressPercent = `${Math.max(5, Math.round((secondsLeft / 600) * 100))}%`;

  async function handleCopyPixCode() {
    if (!qrCode) return;
    await Clipboard.setStringAsync(qrCode);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 3000);
  }

  async function handleSimulatePixApproval() {
    if (!paymentId) return;
    try {
      await simulateApproval(paymentId);
      Alert.alert(
        'Pagamento Pix Aprovado!',
        'Sua reserva foi confirmada e o proprietário foi notificado.',
        [
          {
            text: 'Ver reservas',
            onPress: () => router.replace('/(main)/(tabs)/bookings'),
          },
        ]
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível simular a aprovação deste Pix.');
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.white[1100],
        paddingTop: insets.top + 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingBottom: 14,
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#DBEAFE',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            source={backArrowIconImg}
            style={{
              width: 36,
              height: 36,
              tintColor: theme.colors.blue[1000],
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 22,
            lineHeight: 28,
            color: theme.colors.black[1100],
            includeFontPadding: false,
            textAlignVertical: 'center',
          }}
        >
          Pagamento Pix
        </Text>
      </View>

      {showCopiedToast ? (
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 14,
            backgroundColor: '#6B7280',
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Text
            style={{
              color: '#34D399',
              fontSize: 16,
              fontWeight: '700',
              includeFontPadding: false,
            }}
          >
            ✓
          </Text>
          <Text
            style={{
              fontFamily: theme.fonts.medium,
              fontSize: 13,
              color: '#FFFFFF',
              includeFontPadding: false,
            }}
          >
            Codigo pix copiado com sucesso
          </Text>
        </View>
      ) : null}

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 22,
            color: theme.colors.black[1100],
            marginBottom: 4,
            includeFontPadding: false,
          }}
        >
          Pagamento por Pix:
        </Text>

        <Text
          style={{
            fontFamily: theme.fonts.medium,
            fontSize: 20,
            color: theme.colors.black[900],
            marginBottom: 14,
            includeFontPadding: false,
          }}
        >
          R${Number(totalAmount || 0).toFixed(2).replace('.', ',')}
        </Text>

        {qrCodeBase64 ? (
          <Image
            source={{ uri: `data:image/png;base64,${qrCodeBase64}` }}
            style={{
              width: 165,
              height: 165,
              marginBottom: 14,
              borderRadius: 12,
            }}
            resizeMode="contain"
          />
        ) : null}

        <Text
          style={{
            fontFamily: theme.fonts.regular,
            fontSize: 13,
            color: theme.colors.black[700],
            textAlign: 'center',
            marginBottom: 14,
            includeFontPadding: false,
          }}
        >
          copie e cole o codigo para pagar{'\n'}com o seu banco pelo app.
        </Text>

        <View
          style={{
            width: '100%',
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: '#94A3B8',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: '#FFFFFF',
            marginBottom: 14,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontFamily: theme.fonts.medium,
              fontSize: 12,
              color: theme.colors.blue[1000],
              includeFontPadding: false,
            }}
          >
            {qrCode}
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            backgroundColor: '#DBEAFE',
            overflow: 'hidden',
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: progressPercent as `${number}%`,
              height: '100%',
              backgroundColor: theme.colors.blue[1100],
            }}
          />
        </View>

        <Text
          style={{
            fontFamily: theme.fonts.regular,
            fontSize: 13,
            color: theme.colors.black[700],
            marginBottom: 18,
            includeFontPadding: false,
          }}
        >
          expira em {minutes}:{seconds}
        </Text>

        <View style={{ width: '100%', gap: 10 }}>
          <Button
            title="Copiar codigo pix"
            onPress={() => {
              void handleCopyPixCode();
            }}
          />

          <Button
            title="Simular aprovação do Pix"
            variant="outline"
            isLoading={isSimulating}
            onPress={() => {
              void handleSimulatePixApproval();
            }}
          />

          <TouchableOpacity
            onPress={() => setShowCancelModal(true)}
            style={{
              height: 44,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#94A3B8',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.regular,
                fontSize: 13,
                color: theme.colors.black[700],
                includeFontPadding: false,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}
            >
              Cancelar pagamento por pix ?
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: Math.max(insets.bottom, 24),
              gap: 12,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.bold,
                fontSize: 20,
                color: theme.colors.black[1100],
                textAlign: 'center',
                includeFontPadding: false,
              }}
            >
              Cancelar pagamento por pix ?
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.regular,
                fontSize: 14,
                color: theme.colors.black[700],
                lineHeight: 20,
                includeFontPadding: false,
              }}
            >
              Estamos quase fazendo seu pagamento pelo pix. Se você cancelar,
              você pode começar de novo e escolher outro método de pagamento
            </Text>
            <Button
              title="Continuar com pix"
              onPress={() => setShowCancelModal(false)}
            />
            <TouchableOpacity
              onPress={() => {
                setShowCancelModal(false);
                router.back();
              }}
              style={{
                height: 46,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#FCA5A5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.medium,
                  fontSize: 14,
                  color: '#DC2626',
                  includeFontPadding: false,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              >
                Cancelar pagamento
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}