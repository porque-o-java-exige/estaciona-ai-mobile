import styled from 'styled-components/native';

export type ButtonVariant = 'primary' | 'outline';

interface ContainerProps {
  $variant: ButtonVariant;
  $disabled: boolean;
}

interface LabelProps {
  $variant: ButtonVariant;
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md}px;
  opacity: ${({ $disabled }) => ($disabled ? 0.65 : 1)};
  background-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.blue[1000] : theme.colors.pureWhite};
  border-width: ${({ $variant }) => ($variant === 'outline' ? '1px' : '0px')};
  border-color: ${({ theme }) => theme.colors.black[500]};
`;

export const IconWrapper = styled.View`
  margin-right: 10px;
`;

export const Label = styled.Text<LabelProps>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 15px;
  color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.pureWhite : theme.colors.black[1100]};
`;