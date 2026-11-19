import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[1100]};
`;

export const KeyboardWrapper = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const ScrollContent = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
})``;

export const TopSection = styled.View`
  padding: 20px 24px 22px 24px;
`;

export const LogoImage = styled.Image`
  width: 230px;
  height: 46px;
  margin-bottom: 24px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 26px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const FormCard = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.pureWhite};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-top-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-color: ${({ theme }) => theme.colors.blue[100]};
  padding: 24px 24px 32px 24px;
`;

export const SubmitButtonWrapper = styled.View`
  margin-top: 8px;
`;

export const DividerRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 22px 0;
`;

export const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.white[300]};
`;

export const DividerText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[600]};
  margin: 0 14px;
`;

export const SocialIcon = styled.Image`
  width: 20px;
  height: 20px;
`;

export const FooterLinkButton = styled.TouchableOpacity`
  margin-top: 24px;
  align-items: center;
  padding: 6px;
`;

export const FooterLinkText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;