import { Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

export default function GarageDescriptionPlaceholder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: theme.colors.white[1100],
      }}
    >
      <Text
        style={{
          fontFamily: theme.fonts.bold,
          fontSize: 20,
          color: theme.colors.black[1100],
          marginBottom: 8,
        }}
      >
        garage description
      </Text>
      <Text
        style={{
          fontFamily: theme.fonts.regular,
          fontSize: 13,
          color: theme.colors.black[700],
          marginBottom: 24,
        }}
      >
        ID da garagem: {id}
      </Text>

      <TouchableOpacity onPress={() => router.back()}>
        <Text
          style={{
            fontFamily: theme.fonts.medium,
            fontSize: 15,
            color: theme.colors.blue[1000],
          }}
        >
          Voltar para o mapa
        </Text>
      </TouchableOpacity>
    </View>
  );
}