import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Testar tela Em Breve"
        onPress={() => router.push('/coming-soon')}
      />
    </View>
  );
}