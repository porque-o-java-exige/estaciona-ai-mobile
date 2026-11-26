import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView<{ $topInset: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[1100]};
  padding-top: ${({ $topInset }) => $topInset + 10}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 20px 12px;
  gap: 12px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  padding: 0;
  align-items: center;
  justify-content: center;
`;

export const BackArrowIcon = styled.Image`
  width: 36px;
  height: 36px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const PeerAvatarWrapper = styled.View`
  width: 44px;
  height: 44px;
  position: relative;
`;

export const PeerAvatar = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #cbd5e1;
`;

export const PeerOnlineDot = styled.View`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #22c55e;
  border-width: 1.5px;
  border-color: #ffffff;
`;

export const PeerName = styled.Text.attrs({
  numberOfLines: 1,
})`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
  text-align-vertical: center;
`;

export const HeaderDivider = styled.View`
  height: 1px;
  background-color: #dbeafe;
`;

export const BubbleRow = styled.View<{ $isMine: boolean }>`
  width: 100%;
  flex-direction: row;
  justify-content: ${({ $isMine }) => ($isMine ? 'flex-end' : 'flex-start')};
  margin-bottom: 12px;
`;

export const MessageBubble = styled.View<{ $isMine: boolean }>`
  max-width: 78%;
  background-color: #dbeafe;
  border-width: 1px;
  border-color: #93c5fd;
  padding: 11px 15px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-left-radius: ${({ $isMine }) => ($isMine ? '12px' : '2px')};
  border-bottom-right-radius: ${({ $isMine }) => ($isMine ? '2px' : '12px')};
`;

export const MessageText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const InputBarWrapper = styled.View<{ $bottomInset: number }>`
  padding: 10px 20px ${({ $bottomInset }) => Math.max($bottomInset, 16)}px;
  background-color: ${({ theme }) => theme.colors.white[1100]};
`;

export const InputPill = styled.View`
  flex-direction: row;
  align-items: center;
  height: 50px;
  border-radius: 999px;
  border-width: 1px;
  border-color: #bfdbfe;
  background-color: #ffffff;
  padding: 0 10px 0 18px;
  gap: 8px;
`;

export const MessageInput = styled.TextInput`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
  padding: 0;
  include-font-padding: false;
`;

export const SendButton = styled.TouchableOpacity<{ $disabled: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
`;

export const SendIcon = styled.Image`
  width: 22px;
  height: 22px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;