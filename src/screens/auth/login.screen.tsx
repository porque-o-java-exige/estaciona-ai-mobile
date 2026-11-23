import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import {
  LoginFormData,
  loginSchema,
} from '@/features/auth/schemas/login.schema';
import {
  getLoginErrorMessage,
  useLogin,
} from '@/features/auth/hooks/use-login';

import logoImg from '@assets/images/estaciona-ai-logotype.png';
import emailIconImg from '@assets/images/email-icon.png';
import lockIconImg from '@assets/images/lock-icon.png';
import googleLogoImg from '@assets/images/google-logo.png';
import * as S from './login.styles';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mutateAsync: loginUser, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await loginUser(data);
      router.replace('/(main)/(tabs)/bookings');
    } catch (error) {
      Alert.alert('Erro ao entrar', getLoginErrorMessage(error));
    }
  }

  return (
    <S.Container $topInset={insets.top} $bottomInset={insets.bottom}>
      <S.KeyboardWrapper
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <S.ScrollContent>
          <S.LogoImage source={logoImg} resizeMode="contain" />

          <S.Title>Faça seu login</S.Title>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="E-mail"
                leftIcon={emailIconImg}
                placeholder="voce@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Senha"
                leftIcon={lockIconImg}
                placeholder="Digite sua senha"
                isPassword
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <S.ForgotPasswordButton
            onPress={() => router.push('/coming-soon')}
            activeOpacity={0.7}
          >
            <S.ForgotPasswordText>Esqueceu a senha?</S.ForgotPasswordText>
          </S.ForgotPasswordButton>

          <Button
            title="Entrar"
            isLoading={isPending}
            onPress={() => {
              void handleSubmit(onSubmit)();
            }}
          />

          <S.DividerRow>
            <S.DividerLine />
            <S.DividerText>ou continue com</S.DividerText>
            <S.DividerLine />
          </S.DividerRow>

          <Button
            title="Continuar com o Google"
            variant="outline"
            leftIcon={<S.SocialIcon source={googleLogoImg} resizeMode="contain" />}
            onPress={() => router.push('/coming-soon')}
          />

          <S.FooterLinkButton
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.7}
          >
            <S.FooterLinkText>Ainda não tem uma conta? Cadastre-se</S.FooterLinkText>
          </S.FooterLinkButton>
        </S.ScrollContent>
      </S.KeyboardWrapper>
    </S.Container>
  );
}