import styled from 'styled-components/native';

interface FieldWrapperProps {
  $isFocused: boolean;
  $hasError: boolean;
}

export const Container = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1000]};
  margin-bottom: 6px;
`;

export const FieldWrapper = styled.View<FieldWrapperProps>`
  flex-direction: row;
  align-items: center;
  height: 48px;
  padding: 0 14px;
  background-color: ${({ theme }) => theme.colors.pureWhite};
  border-radius: ${({ theme }) => theme.radii.md}px;
  border-width: 1px;
  border-color: ${({ theme, $isFocused, $hasError }) => {
    if ($hasError) return theme.colors.red[900];
    if ($isFocused) return theme.colors.blue[900];
    return theme.colors.blue[200];
  }};
`;

export const LeftIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

export const StyledTextInput = styled.TextInput`
  flex: 1;
  height: 100%;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const RightAction = styled.TouchableOpacity`
  margin-left: 8px;
  padding: 4px;
`;

export const HelperText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[600]};
  margin-top: 6px;
`;

export const ErrorText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.red[1000]};
  margin-top: 6px;
`;