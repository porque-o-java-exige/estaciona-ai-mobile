import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { Button } from '@/components/ui/button.component';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/stores/use-auth-store';

export default function BookingsPlaceholderScreen() {
  const router = useRouter();
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  async function handleLogout() {
    try {
      await authService.logout();
    } catch {
      // Ensures local cleanup even if token expired
    } finally {
      await clearSession();
      router.replace('/(auth)/login');
    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: theme.colors.white[1100],
      }}
    >
      <Text
        style={{
          fontFamily: theme.fonts.bold,
          fontSize: 22,
          color: theme.colors.black[1100],
          marginBottom: 8,
        }}
      >
        Olá, {user?.name ?? 'Motorista'}!
      </Text>
      <Text
        style={{
          fontFamily: theme.fonts.regular,
          fontSize: 14,
          color: theme.colors.black[700],
          marginBottom: 24,
        }}
      >
        Sessão JWT ativa ({user?.email}).
      </Text>

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
