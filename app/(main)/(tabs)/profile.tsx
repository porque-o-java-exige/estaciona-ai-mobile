import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'styled-components/native';

import { Button } from '@/components/ui/button.component';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/stores/use-auth-store';

export default function ProfileTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  async function handleLogout() {
    try {
      await authService.logout();
    } finally {
      await clearSession();
      queryClient.clear();
      router.replace('/(auth)/login');
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.white[1100],
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 110,
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 22,
            color: theme.colors.black[1100],
            marginBottom: 16,
          }}
        >
          Perfil
        </Text>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            padding: 16,
            gap: 4,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.bold,
              fontSize: 16,
              color: theme.colors.black[1100],
            }}
          >
            {user?.name || 'Usuário'}
          </Text>
          {user?.email ? (
            <Text
              style={{
                fontFamily: theme.fonts.regular,
                fontSize: 13,
                color: theme.colors.black[700],
              }}
            >
              {user.email}
            </Text>
          ) : null}
        </View>
      </View>

      <Button
        title="Sair da conta"
        variant="outline"
        onPress={() => {
          void handleLogout();
        }}
      />
    </View>
  );
}