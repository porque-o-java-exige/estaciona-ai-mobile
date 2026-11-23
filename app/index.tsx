import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRootNavigationState, useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useAuthStore } from '@/stores/use-auth-store';

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const theme = useTheme();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!rootNavigationState?.key || !isHydrated) {
      return;
    }

    if (isAuthenticated) {
      router.replace('/(main)/(tabs)/bookings');
    } else {
      router.replace('/(auth)/login');
    }
  }, [rootNavigationState?.key, isHydrated, isAuthenticated, router]);

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