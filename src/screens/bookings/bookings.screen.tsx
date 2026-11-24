import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import {
  useCancelBooking,
  useMyBookings,
} from '@/features/bookings/hooks/use-bookings';
import { useOpenBookingChat } from '@/features/chat/hooks/use-chat';

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const { data: bookings = [], isLoading, refetch } = useMyBookings();
  const { mutateAsync: cancelBooking } = useCancelBooking();
  const { mutateAsync: openBookingChat } = useOpenBookingChat();

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

  async function handleCancel(bookingId: string) {
    try {
      await cancelBooking(bookingId);
      void refetch();
    } catch {
      Alert.alert('Erro', 'Não foi possível cancelar a reserva.');
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.white[1100],
        paddingTop: insets.top + 14,
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontFamily: theme.fonts.bold,
          fontSize: 22,
          color: theme.colors.black[1100],
          marginBottom: 16,
        }}
      >
        Reservas
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.blue[1000]} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.bookingId}
          contentContainerStyle={{ paddingBottom: 110, gap: 12 }}
          ListEmptyComponent={
            <Text
              style={{
                fontFamily: theme.fonts.regular,
                fontSize: 14,
                color: theme.colors.black[700],
              }}
            >
              Nenhuma reserva encontrada.
            </Text>
          }
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#DBEAFE',
                padding: 14,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 14,
                    color: theme.colors.black[1100],
                  }}
                >
                  Reserva #{item.bookingId.slice(0, 8)}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 12,
                    color: theme.colors.blue[1000],
                  }}
                >
                  {item.status}
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: theme.fonts.regular,
                  fontSize: 12,
                  color: theme.colors.black[700],
                  marginBottom: 10,
                }}
              >
                Tipo: {item.bookingType} • Total: R$ {item.totalAmount}
              </Text>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    void handleOpenChat(item.bookingId);
                  }}
                  style={{
                    backgroundColor: theme.colors.blue[1000],
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fonts.medium,
                      fontSize: 13,
                      color: '#FFFFFF',
                    }}
                  >
                    Abrir Chat
                  </Text>
                </TouchableOpacity>

                {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' ? (
                  <TouchableOpacity
                    onPress={() => {
                      void handleCancel(item.bookingId);
                    }}
                    style={{
                      borderWidth: 1,
                      borderColor: '#FCA5A5',
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fonts.medium,
                        fontSize: 13,
                        color: '#DC2626',
                      }}
                    >
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}