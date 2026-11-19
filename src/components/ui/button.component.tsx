import { ReactNode } from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import * as S from './button.styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: S.ButtonVariant;
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  leftIcon,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || isLoading;

  return (
    <S.Container
      $variant={variant}
      $disabled={isDisabled}
      disabled={isDisabled}
      activeOpacity={0.85}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary'
              ? theme.colors.pureWhite
              : theme.colors.blue[1000]
          }
        />
      ) : (
        <>
          {leftIcon && <S.IconWrapper>{leftIcon}</S.IconWrapper>}
          <S.Label $variant={variant}>{title}</S.Label>
        </>
      )}
    </S.Container>
  );
}