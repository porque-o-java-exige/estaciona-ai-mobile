import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[1100]};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black[1000]};
`;

export const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 28px 32px 28px;
`;

export const Illustration = styled.Image`
  width: 260px;
  height: 260px;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 26px;
  color: ${({ theme }) => theme.colors.black[1100]};
  text-align: center;
  line-height: 34px;
  margin-bottom: 12px;
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[700]};
  text-align: center;
  line-height: 21px;
  margin-bottom: 32px;
`;

export const PrimaryButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.blue[1000]};
  border-radius: ${({ theme }) => theme.radii.md}px;
  align-items: center;
  justify-content: center;
`;

export const PrimaryButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.pureWhite};
  font-size: 15px;
`;