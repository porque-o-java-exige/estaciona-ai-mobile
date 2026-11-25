import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import {
  useMarkNotificationRead,
  useUserNotifications,
} from '@/features/notifications/hooks/use-notifications';

import backArrowIconImg from '@assets/images/back-arrow-icon.png';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const { data: notifications = [], isLoading } = useUserNotifications();
  const { mutateAsync: markAsRead } = useMarkNotificationRead();

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
          Notificações
        </Text>
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size="large" color={theme.colors.blue[1000]} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          ListEmptyComponent={
            <Text
              style={{
                fontFamily: theme.fonts.regular,
                fontSize: 14,
                color: theme.colors.black[700],
                textAlign: 'center',
                marginTop: 24,
                includeFontPadding: false,
              }}
            >
              Você ainda não possui notificações.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                if (!item.isRead) {
                  void markAsRead(item.id);
                }
              }}
              style={{
                backgroundColor: item.isRead ? '#FFFFFF' : '#EFF6FF',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: item.isRead ? '#E2E8F0' : '#93C5FD',
                padding: 14,
                gap: 4,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 15,
                    color: theme.colors.black[1100],
                    includeFontPadding: false,
                  }}
                >
                  {item.title}
                </Text>
                {!item.isRead ? (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.colors.blue[1000],
                    }}
                  />
                ) : null}
              </View>

              <Text
                style={{
                  fontFamily: theme.fonts.regular,
                  fontSize: 13,
                  color: theme.colors.black[800],
                  includeFontPadding: false,
                }}
              >
                {item.message}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}