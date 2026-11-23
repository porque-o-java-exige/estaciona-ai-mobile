import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';

import { queryClient } from '@/lib/query-client';
import { theme } from '@/theme/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontTimeout, setFontTimeout] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFontTimeout(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const isReady = fontsLoaded || Boolean(fontError) || fontTimeout;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(main)" />
            <Stack.Screen name="coming-soon" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}