import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import {
  RegisterFormData,
  registerSchema,
} from '@/features/users/schemas/register.schema';
import {
  getRegisterErrorMessage,
  useRegisterUser,
} from '@/features/users/hooks/use-register-user';
import { formatPhoneBR } from '@/utils/formatters';

import logoImg from '@assets/images/estaciona-ai-logotype.png';
import userIconImg from '@assets/images/user-icon.png';
import emailIconImg from '@assets/images/email-icon.png';
import lockIconImg from '@assets/images/lock-icon.png';
import phoneIconImg from '@assets/images/phone-icon.png';
import googleLogoImg from '@assets/images/google-logo.png';
import * as S from './register.styles';

export default function RegisterScreen() {
  const router = useRouter();
  const { mutateAsync: registerUser, isPending } = useRegisterUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUser(data);
      Alert.alert(
        'Conta criada!',
        'Seu cadastro foi realizado com sucesso. Faça login para continuar.',
        [
          {
            text: 'Ir para o login',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro no cadastro', getRegisterErrorMessage(error));
    }
  }

  return (
    <S.Container edges={['top']}>
      <S.KeyboardWrapper
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <S.ScrollContent>
          <S.TopSection>
            <S.LogoImage source={logoImg} resizeMode="contain" />
            <S.Title>Crie sua conta</S.Title>
          </S.TopSection>

          <S.FormCard>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome completo"
                  leftIcon={userIconImg}
                  placeholder="Como você se chama?"
                  autoCapitalize="words"
                  autoComplete="name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.name?.message}
                />
              )}
            />

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
                  placeholder="Crie uma senha"
                  isPassword
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={18}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  helperText="Use pelo menos 8 caracteres."
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Celular"
                  leftIcon={phoneIconImg}
                  placeholder="+55 (11) 99999-9999"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  maxLength={19}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(formatPhoneBR(text))}
                  error={errors.phoneNumber?.message}
                />
              )}
            />

            <S.SubmitButtonWrapper>
              <Button
                title="Cadastrar"
                isLoading={isPending}
                onPress={() => {
                  void handleSubmit(onSubmit)();
                }}
              />
            </S.SubmitButtonWrapper>

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
              onPress={() => router.push('/(auth)/login')}
              activeOpacity={0.7}
            >
              <S.FooterLinkText>Já tem uma conta? Entrar</S.FooterLinkText>
            </S.FooterLinkButton>
          </S.FormCard>
        </S.ScrollContent>
      </S.KeyboardWrapper>
    </S.Container>
  );
}