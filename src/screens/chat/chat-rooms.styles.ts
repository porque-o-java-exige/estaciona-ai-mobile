import styled from 'styled-components/native';

export const Container = styled.View<{ $topInset: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[1100]};
  padding-top: ${({ $topInset }) => $topInset + 10}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 20px 14px;
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

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 22px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
  text-align-vertical: center;
`;

export const CountBadge = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border-width: 1px;
  border-color: #93c5fd;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

export const CountBadgeText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const HeaderDivider = styled.View`
  height: 1px;
  background-color: #dbeafe;
`;

export const RoomRow = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 14px 20px;
  gap: 14px;
  background-color: transparent;
  border-bottom-width: 1px;
  border-bottom-color: #dbeafe;
`;

export const AvatarContainer = styled.View`
  width: 54px;
  height: 54px;
  position: relative;
`;

export const AvatarImage = styled.Image`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background-color: #cbd5e1;
`;

export const OnlineDot = styled.View`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #22c55e;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.white[1100]};
`;

export const RoomMiddle = styled.View`
  flex: 1;
  gap: 4px;
`;

export const RoomName = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const RoomPreview = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[700]};
  include-font-padding: false;
`;

export const RoomRight = styled.View`
  align-items: flex-end;
  justify-content: space-between;
  gap: 6px;
`;

export const TimeText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
  include-font-padding: false;
`;

export const MessageCountPill = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #dbeafe;
  align-items: center;
  justify-content: center;
`;

export const MessageCountText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const EmptyBox = styled.View`
  margin: 24px 20px;
  padding: 24px 18px;
  border-radius: 16px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #dbeafe;
  align-items: center;
`;

export const EmptyText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[700]};
  text-align: center;
  include-font-padding: false;
`;