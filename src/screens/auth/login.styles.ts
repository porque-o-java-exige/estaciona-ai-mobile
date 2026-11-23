import styled from 'styled-components/native';

export const Container = styled.View<{ $topInset: number; $bottomInset: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[1100]};
  padding-top: ${({ $topInset }) => $topInset}px;
  padding-bottom: ${({ $bottomInset }) => $bottomInset}px;
`;

export const KeyboardWrapper = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const ScrollContent = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
})``;

export const LogoImage = styled.Image`
  width: 230px;
  height: 46px;
  margin-bottom: 36px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 26px;
  color: ${({ theme }) => theme.colors.black[1100]};
  margin-bottom: 24px;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
  align-self: flex-end;
  margin-top: -4px;
  margin-bottom: 20px;
  padding: 4px 0;
`;

export const ForgotPasswordText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.blue[1000]};
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