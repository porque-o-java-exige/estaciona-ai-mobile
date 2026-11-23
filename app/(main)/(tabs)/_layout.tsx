import { Tabs } from 'expo-router';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar.component';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Reservas' }} />
      <Tabs.Screen name="payment" options={{ title: 'Pagamento' }} />
      <Tabs.Screen name="chat" options={{ title: 'Conversas' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
      <Tabs.Screen name="vehicles" options={{ href: null }} />
    </Tabs>
  );
}