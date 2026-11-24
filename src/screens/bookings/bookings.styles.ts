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
  gap: 14px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

export const BackArrowIcon = styled.Image`
  width: 18px;
  height: 18px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 22px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const HeaderDivider = styled.View`
  height: 1px;
  background-color: #dbeafe;
  margin-bottom: 14px;
`;

export const FilterTabsScroll = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: 20,
    gap: 8,
  },
})`
  flex-grow: 0;
  margin-bottom: 16px;
`;

export const FilterTabPill = styled.TouchableOpacity<{ $active: boolean }>`
  padding: 7px 16px;
  border-radius: 999px;
  border-width: 1px;
  border-color: ${({ $active, theme }) =>
    $active ? theme.colors.blue[1000] : '#93C5FD'};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.blue[1000] : '#FFFFFF'};
`;

export const FilterTabText = styled.Text<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 13px;
  color: ${({ $active, theme }) =>
    $active ? '#FFFFFF' : theme.colors.blue[800]};
`;

export const BookingCard = styled.View`
  background-color: #f4f8ff;
  border-radius: 16px;
  border-width: 1px;
  border-color: #bfdbfe;
  overflow: hidden;
  elevation: 2;
  shadow-color: #0f172a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
`;

export const CardTopSection = styled.View`
  background-color: #eaf2ff;
  padding: 14px 16px 12px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

export const CardTopInfo = styled.View`
  flex: 1;
`;

export const GarageTitleText = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.black[1100]};
  margin-bottom: 3px;
`;

export const ScheduleText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
`;

export const StatusBadge = styled.View<{ $variant: 'active' | 'soft' }>`
  padding: 4px 14px;
  border-radius: 999px;
  background-color: ${({ $variant, theme }) =>
    $variant === 'active' ? theme.colors.blue[1000] : '#DBEAFE'};
`;

export const StatusBadgeText = styled.Text<{ $variant: 'active' | 'soft' }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 11px;
  color: ${({ $variant, theme }) =>
    $variant === 'active' ? '#FFFFFF' : theme.colors.blue[800]};
`;

export const CardBottomSection = styled.View`
  background-color: #f8fbff;
  padding: 12px 16px 14px;
`;

export const CardDetailsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const LeftDetailsGroup = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 12px;
`;

export const CarIconBox = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #93c5fd;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

export const CarBookingIcon = styled.Image`
  width: 22px;
  height: 22px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const SpotInfoColumn = styled.View`
  flex: 1;
`;

export const MutedCaption = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-bottom: 2px;
`;

export const SpotDetailValue = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const PriceColumn = styled.View`
  align-items: flex-end;
`;

export const TotalAmountValue = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const CardActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: #e2e8f0;
`;

export const ChatActionBtn = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #dbeafe;
`;

export const ChatActionIcon = styled.Image`
  width: 14px;
  height: 14px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const ChatActionText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const CancelActionBtn = styled.TouchableOpacity`
  padding: 8px 14px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #fca5a5;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

export const CancelActionText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: #dc2626;
`;

export const EmptyBox = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  border-width: 1px;
  border-color: #dbeafe;
  padding: 24px 18px;
  align-items: center;
  margin-top: 12px;
`;

export const EmptyText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[700]};
  text-align: center;
`;