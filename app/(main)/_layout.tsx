import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="booking/new" />
      <Stack.Screen name="chat/[bookingId]" />
      <Stack.Screen name="garage/[id]" />
      <Stack.Screen name="payment/[bookingId]" />
    </Stack>
  );
}