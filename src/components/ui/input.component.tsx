import { useState } from 'react';
import { ImageSourcePropType, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import * as S from './input.styles';

interface InputProps extends TextInputProps {
  label: string;
  leftIcon: ImageSourcePropType;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
}

export function Input({
  label,
  leftIcon,
  error,
  helperText,
  isPassword = false,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <S.Container>
      <S.Label>{label}</S.Label>

      <S.FieldWrapper $isFocused={isFocused} $hasError={Boolean(error)}>
        <S.LeftIcon
          source={leftIcon}
          resizeMode="contain"
          tintColor={error ? theme.colors.red[900] : undefined}
        />

        <S.StyledTextInput
          placeholderTextColor={theme.colors.black[600]}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {isPassword && (
          <S.RightAction
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.blue[900]}
            />
          </S.RightAction>
        )}
      </S.FieldWrapper>

      {error ? (
        <S.ErrorText>{error}</S.ErrorText>
      ) : helperText ? (
        <S.HelperText>{helperText}</S.HelperText>
      ) : null}
    </S.Container>
  );
}