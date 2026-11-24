import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import { useChatRooms } from '@/features/chat/hooks/use-chat';
import { useAuthStore } from '@/stores/use-auth-store';

export default function ChatRoomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);

  const { data: rooms = [], isLoading } = useChatRooms();

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
        Conversas ({rooms.length})
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.blue[1000]} />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.roomId}
          contentContainerStyle={{ paddingBottom: 110, gap: 10 }}
          ListEmptyComponent={
            <Text
              style={{
                fontFamily: theme.fonts.regular,
                fontSize: 14,
                color: theme.colors.black[700],
              }}
            >
              Nenhuma conversa ativa ainda.
            </Text>
          }
          renderItem={({ item }) => {
            const isDriver = item.driverId === user?.id;
            const roleLabel = isDriver
              ? 'Conversa com Proprietário'
              : 'Conversa com Motorista';

            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/(main)/chat/[bookingId]',
                    params: {
                      bookingId: item.bookingId,
                      roomId: item.roomId,
                    },
                  })
                }
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  padding: 14,
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 15,
                    color: theme.colors.black[1100],
                    marginBottom: 4,
                  }}
                >
                  {roleLabel}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.regular,
                    fontSize: 12,
                    color: theme.colors.black[700],
                  }}
                >
                  Reserva #{item.bookingId.slice(0, 8)} • Sala #{item.roomId.slice(0, 8)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}