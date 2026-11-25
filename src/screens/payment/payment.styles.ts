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

export const HeaderDivider = styled.View`
  height: 1px;
  background-color: #dbeafe;
`;

export const ScrollBody = styled.ScrollView.attrs<{ $bottomInset: number }>(
  ({ $bottomInset }) => ({
    contentContainerStyle: {
      padding: 20,
      paddingBottom: $bottomInset + 150,
      gap: 16,
    },
    showsVerticalScrollIndicator: false,
  })
)<{ $bottomInset: number }>``;

export const PendingBookingsList = styled.View`
  gap: 10px;
`;

export const BookingSelectCard = styled.TouchableOpacity<{ $selected: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.blue[1000] : '#DBEAFE'};
  padding: 10px;
  gap: 12px;
  opacity: ${({ $selected }) => ($selected ? 1 : 0.72)};
`;

export const BookingThumb = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background-color: #1e293b;
`;

export const BookingInfoColumn = styled.View`
  flex: 1;
`;

export const BookingName = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
  margin-bottom: 2px;
  include-font-padding: false;
`;

export const BookingAddress = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-bottom: 6px;
  include-font-padding: false;
`;

export const BookingMetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const BookingMetaText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.blue[800]};
  include-font-padding: false;
`;

export const CheckboxBox = styled.View<{ $checked: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border-width: 1.5px;
  border-color: ${({ $checked, theme }) =>
    $checked ? theme.colors.blue[1000] : '#93C5FD'};
  background-color: ${({ $checked }) => ($checked ? '#EFF6FF' : '#FFFFFF')};
  align-items: center;
  justify-content: center;
`;

export const CheckIconImage = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const SummaryCard = styled.View`
  background-color: #f8fbff;
  border-radius: 16px;
  border-width: 1px;
  border-color: #bfdbfe;
  padding: 16px;
  gap: 10px;
`;

export const SummaryTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black[1100]};
  margin-bottom: 2px;
  include-font-padding: false;
`;

export const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SummaryBlueLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.blue[800]};
  include-font-padding: false;
`;

export const SummaryBlueValue = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const SummaryGreenValue = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 13px;
  color: #16a34a;
  include-font-padding: false;
`;

export const SummaryDivider = styled.View`
  height: 1px;
  background-color: #dbeafe;
  margin: 2px 0;
`;

export const TotalLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const TotalValue = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 17px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const MethodsSectionCard = styled.View`
  background-color: #f8fbff;
  border-radius: 16px;
  border-width: 1px;
  border-color: #bfdbfe;
  padding: 16px;
  gap: 12px;
`;

export const MethodsTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.blue[800]};
  include-font-padding: false;
`;

export const MethodOptionCard = styled.TouchableOpacity<{ $selected: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.blue[1000] : '#93C5FD'};
  padding: 14px;
  gap: 12px;
`;

export const MethodLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 12px;
`;

export const MethodBadgeIcon = styled.View<{ $bg: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${({ $bg }) => $bg};
  align-items: center;
  justify-content: center;
`;

export const MethodBadgeSymbol = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 16px;
  color: #ffffff;
  include-font-padding: false;
`;

export const MethodTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const MethodSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[700]};
  include-font-padding: false;
`;

export const RadioOuter = styled.View<{ $selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.blue[1000]};
  align-items: center;
  justify-content: center;
`;

export const RadioInner = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const CpfBox = styled.View`
  gap: 6px;
`;

export const CpfLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[900]};
  include-font-padding: false;
`;

export const CpfInput = styled.TextInput`
  height: 42px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #93c5fd;
  background-color: #ffffff;
  padding: 0 12px;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const BottomPayBar = styled.View<{ $bottomInset: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${({ $bottomInset }) => Math.max($bottomInset, 12) + 76}px;
  padding: 0 20px;
`;

export const PayBlackButton = styled.TouchableOpacity<{ $disabled?: boolean }>`
  height: 54px;
  border-radius: 14px;
  background-color: ${({ $disabled }) => ($disabled ? '#94A3B8' : '#121212')};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  elevation: 4;
`;

export const PayBlackButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 16px;
  color: #ffffff;
  include-font-padding: false;
  text-align: center;
  text-align-vertical: center;
`;