import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import comingSoonImg from '@/assets/images/coming-soon.png';
import * as S from './coming-soon.styles';

export default function ComingSoonScreen() {
  const router = useRouter();
  const theme = useTheme();

  function handleGoBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  function handleGoHome() {
    if (router.canGoBack()) {
      router.dismissAll();
    }
    router.replace('/');
  }

  return (
    <S.Container edges={['top', 'bottom']}>
      <S.Header>
        <S.BackButton
          onPress={handleGoBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.blue[1000]}
          />
        </S.BackButton>
        <S.HeaderTitle>Em breve</S.HeaderTitle>
      </S.Header>

      <S.Content>
        <S.Illustration source={comingSoonImg} resizeMode="contain" />

        <S.Title>
          Estamos preparando{'\n'}algo novo.
        </S.Title>

        <S.Subtitle>
          Esta novidade ainda está a caminho.{'\n'}
          Em breve, você poderá explorar por aqui.
        </S.Subtitle>

        <S.PrimaryButton onPress={handleGoHome} activeOpacity={0.85}>
          <S.PrimaryButtonText>Voltar ao início</S.PrimaryButtonText>
        </S.PrimaryButton>
      </S.Content>
    </S.Container>
  );
}