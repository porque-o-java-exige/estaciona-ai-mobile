import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[1100]};
`;

export const ScrollContent = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 110,
  },
  showsVerticalScrollIndicator: false,
})``;

export const HeroContainer = styled.View`
  width: 100%;
  height: 310px;
  background-color: #1e293b;
  position: relative;
`;

export const HeroImage = styled.Image`
  height: 310px;
`;

export const BackButton = styled.TouchableOpacity<{ $topInset: number }>`
  position: absolute;
  top: ${({ $topInset }) => $topInset + 10}px;
  left: 20px;
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: rgba(15, 23, 42, 0.72);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.35);
  align-items: center;
  justify-content: center;
`;

export const BackArrowIcon = styled.Image`
  width: 18px;
  height: 18px;
  tint-color: #ffffff;
`;

export const AvailabilityBadge = styled.View<{ $available: boolean }>`
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 5px 12px;
  border-radius: 999px;
  background-color: rgba(15, 23, 42, 0.78);
  border-width: 1px;
  border-color: ${({ $available }) => ($available ? '#22C55E' : '#EF4444')};
`;

export const AvailabilityText = styled.Text<{ $available: boolean }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 11px;
  color: ${({ $available }) => ($available ? '#4ADE80' : '#FCA5A5')};
`;

export const PaginationDots = styled.View`
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

export const Dot = styled.View<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? 10 : 8)}px;
  height: ${({ $active }) => ($active ? 10 : 8)}px;
  border-radius: 5px;
  background-color: ${({ $active }) =>
    $active ? '#0F172A' : 'rgba(255, 255, 255, 0.85)'};
  border-width: 1px;
  border-color: #ffffff;
`;

export const ContentBody = styled.View`
  padding: 20px;
`;

export const TitlePriceRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

export const TitleColumn = styled.View`
  flex: 1;
`;

export const GarageName = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 21px;
  color: ${({ theme }) => theme.colors.black[1100]};
  margin-bottom: 6px;
`;

export const GarageAddress = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-bottom: 6px;
`;

export const GarageDescriptionText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[800]};
  line-height: 19px;
`;

export const PriceBox = styled.View`
  align-items: flex-end;
`;

export const PriceValue = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const PriceUnit = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
`;

export const RateToggleRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 12px;
`;

export const RateToggleChip = styled.TouchableOpacity<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 999px;
  border-width: 1px;
  border-color: ${({ $active, theme }) =>
    $active ? theme.colors.blue[1000] : theme.colors.white[300]};
  background-color: ${({ $active }) => ($active ? '#DBEAFE' : '#FFFFFF')};
`;

export const RateToggleText = styled.Text<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.blue[1000] : theme.colors.black[700]};
`;

export const BadgesRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  margin-bottom: 22px;
`;

export const InfoPill = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  border-width: 1px;
  border-color: #bfdbfe;
  background-color: #ffffff;
  gap: 4px;
`;

export const StarIcon = styled.Image<{ $filled: boolean }>`
  width: 13px;
  height: 13px;
  tint-color: ${({ $filled, theme }) =>
    $filled ? theme.colors.blue[1000] : '#CBD5E1'};
`;

export const DistanceIcon = styled.Image`
  width: 13px;
  height: 13px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const PillBoldText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[1100]};
  margin-left: 3px;
`;

export const PillMutedText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: #94a3b8;
`;

export const SectionTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black[1100]};
  margin-bottom: 12px;
`;

export const FeaturesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
`;

export const FeatureChip = styled.View`
  padding: 7px 14px;
  border-radius: 999px;
  border-width: 1px;
  border-color: #93c5fd;
  background-color: #ffffff;
`;

export const FeatureChipText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const OwnerCard = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 14px;
  border-width: 1px;
  border-color: #93c5fd;
  background-color: #ffffff;
`;

export const OwnerLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 12px;
`;

export const OwnerAvatar = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.blue[1000]};
  align-items: center;
  justify-content: center;
`;

export const OwnerAvatarText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 16px;
  color: #ffffff;
`;

export const OwnerName = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const OwnerSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
`;

export const ChatButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #93c5fd;
  background-color: #eff6ff;
`;

export const ChatButtonIcon = styled.Image`
  width: 15px;
  height: 15px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const ChatButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const FooterBar = styled.View<{ $bottomInset: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 20px ${({ $bottomInset }) => Math.max($bottomInset, 16)}px;
  background-color: ${({ theme }) => theme.colors.white[1100]};
`;

/* Modal de confirmação de reserva */
export const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(15, 23, 42, 0.55);
  justify-content: flex-end;
`;

export const ModalCard = styled.View<{ $bottomInset: number }>`
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 22px 20px ${({ $bottomInset }) => Math.max($bottomInset, 20)}px;
  max-height: 88%;
`;

export const ModalTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black[1100]};
  margin-bottom: 4px;
`;

export const ModalSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-bottom: 14px;
`;

export const FieldLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[900]};
  margin-bottom: 8px;
`;

export const VehicleChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
`;

export const VehicleChip = styled.TouchableOpacity<{ $selected: boolean }>`
  padding: 8px 14px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.blue[1000] : '#CBD5E1'};
  background-color: ${({ $selected }) => ($selected ? '#DBEAFE' : '#FFFFFF')};
`;

export const VehicleChipText = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.blue[1000] : theme.colors.black[900]};
`;

export const EmptyVehicleCard = styled.View`
  background-color: #f8fafc;
  border-radius: 12px;
  border-width: 1px;
  border-color: #cbd5e1;
  padding: 12px;
  margin-bottom: 14px;
  gap: 8px;
`;

export const QuickVehicleRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const QuickVehicleInput = styled.TextInput`
  flex: 1;
  height: 40px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #cbd5e1;
  border-radius: 10px;
  padding: 0 12px;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

/* Calendário mensal para Diária */
export const CalendarBox = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  border-width: 1px;
  border-color: #bfdbfe;
  padding: 14px;
  margin-bottom: 16px;
`;

export const CalendarHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const CalendarMonthTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black[1100]};
  text-transform: capitalize;
`;

export const CalendarNavGroup = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const CalendarNavBtn = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border-width: 1px;
  border-color: #93c5fd;
  align-items: center;
  justify-content: center;
`;

export const CalendarNavText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const WeekDaysRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const WeekDayText = styled.Text`
  width: 14.28%;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
`;

export const DaysGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const DayCellSlot = styled.View`
  width: 14.28%;
  align-items: center;
  margin-bottom: 6px;
`;

export const DayCircleBtn = styled.TouchableOpacity<{
  $selected: boolean;
  $isToday: boolean;
  $disabled: boolean;
}>`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.blue[1000] : 'transparent'};
  border-width: ${({ $isToday, $selected }) =>
    $isToday && !$selected ? '1.5px' : '0px'};
  border-color: #f59e0b;
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
`;

export const DayNumberText = styled.Text<{
  $selected: boolean;
  $disabled: boolean;
}>`
  font-family: ${({ theme, $selected }) =>
    $selected ? theme.fonts.bold : theme.fonts.medium};
  font-size: 13px;
  color: ${({ $selected, theme }) =>
    $selected ? '#FFFFFF' : theme.colors.black[1100]};
`;

export const DurationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

export const StepperControls = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 14px;
`;

export const StepperBtn = styled.TouchableOpacity`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.blue[1000]};
  align-items: center;
  justify-content: center;
`;

export const StepperBtnText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const DurationValueText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const ModalActionsRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;