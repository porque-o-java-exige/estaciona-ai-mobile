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

export const ProfileTopCard = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px 20px 16px;
  gap: 14px;
`;

export const AvatarWrapper = styled.TouchableOpacity`
  width: 64px;
  height: 64px;
  position: relative;
`;

export const AvatarImage = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: #cbd5e1;
`;

export const VerifiedBadgeIcon = styled.Image`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
`;

export const UserInfoColumn = styled.View`
  flex: 1;
  gap: 2px;
`;

export const UserName = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const UserEmail = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[700]};
  include-font-padding: false;
`;

export const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

export const StarIcon = styled.Image`
  width: 15px;
  height: 15px;
`;

export const RatingText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[900]};
  include-font-padding: false;
`;

export const BookingsCountText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-left: 4px;
  include-font-padding: false;
`;

export const EditProfileBtn = styled.TouchableOpacity`
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.blue[1000]};
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const EditProfileText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const EditProfileIcon = styled.Image`
  width: 15px;
  height: 15px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const WalletCard = styled.View`
  margin: 0 20px 14px;
  background-color: #16489c;
  border-radius: 16px;
  padding: 18px;
  gap: 10px;
`;

export const WalletLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: #dbeafe;
  include-font-padding: false;
`;

export const WalletMiddleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const WalletAmount = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 28px;
  color: #ffffff;
  include-font-padding: false;
`;

export const RechargeBtn = styled.TouchableOpacity`
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  background-color: #dbeafe;
  align-items: center;
  justify-content: center;
`;

export const RechargeBtnText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 13px;
  color: #16489c;
  include-font-padding: false;
`;

export const WalletCardSub = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: #bfdbfe;
  include-font-padding: false;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  padding: 0 20px;
  gap: 10px;
  margin-bottom: 14px;
`;

export const StatBox = styled.View`
  flex: 1;
  background-color: #dbeafe;
  border-radius: 12px;
  padding: 12px 8px;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

export const StatValue = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 17px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const StatLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[800]};
  include-font-padding: false;
`;

export const TabsRow = styled.View`
  flex-direction: row;
  padding: 0 20px;
  gap: 8px;
  margin-bottom: 16px;
`;

export const TabPill = styled.TouchableOpacity<{ $active: boolean }>`
  flex: 1;
  height: 34px;
  border-radius: 10px;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.blue[1000] : '#DBEAFE'};
  align-items: center;
  justify-content: center;
`;

export const TabPillText = styled.Text<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ $active, theme }) =>
    $active ? '#FFFFFF' : theme.colors.blue[900]};
  include-font-padding: false;
`;

export const SectionList = styled.View`
  padding: 0 20px;
  gap: 12px;
`;

export const ActiveBookingCard = styled.View`
  background-color: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: #93c5fd;
  padding: 14px;
  gap: 12px;
`;

export const ActiveBookingTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const ActiveBookingBody = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const SoftIconBox = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #93c5fd;
  background-color: #eff6ff;
  align-items: center;
  justify-content: center;
`;

export const OptionIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const ActiveBookingInfo = styled.View`
  flex: 1;
  gap: 2px;
`;

export const ItemTitle = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const ItemSubtitle = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
  include-font-padding: false;
`;

export const ActiveBookingFooter = styled.View`
  border-top-width: 1px;
  border-top-color: #e2e8f0;
  padding-top: 8px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const ActiveBookingHint = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.blue[800]};
  include-font-padding: false;
`;

export const MenuOptionCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: #dbeafe;
  padding: 12px 14px;
  gap: 12px;
`;

export const MenuOptionLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 12px;
`;

export const MenuOptionTextCol = styled.View`
  flex: 1;
  gap: 2px;
`;

export const MenuOptionBlueSub = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[700]};
  include-font-padding: false;
`;

export const ChevronText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const VehicleCard = styled.View<{ $primary?: boolean }>`
  background-color: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ $primary, theme }) =>
    $primary ? theme.colors.blue[1000] : '#DBEAFE'};
  padding: 14px;
  gap: 10px;
`;

export const VehicleTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const VehicleInfoCol = styled.View`
  flex: 1;
  gap: 6px;
`;

export const PlateBadge = styled.View`
  align-self: flex-start;
  background-color: #dbeafe;
  border-radius: 6px;
  padding: 4px 10px;
`;

export const PlateBadgeText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const PrimaryBadge = styled.View`
  background-color: #dbeafe;
  border-radius: 8px;
  padding: 4px 10px;
`;

export const PrimaryBadgeText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const SmallActionsRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
  border-top-width: 1px;
  border-top-color: #f1f5f9;
  padding-top: 8px;
`;

export const SmallActionBtn = styled.TouchableOpacity<{ $danger?: boolean }>`
  padding: 4px 10px;
  border-radius: 6px;
  background-color: ${({ $danger }) => ($danger ? '#FEE2E2' : '#EFF6FF')};
`;

export const SmallActionText = styled.Text<{ $danger?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ $danger, theme }) =>
    $danger ? '#DC2626' : theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const DashedAddButton = styled.TouchableOpacity`
  height: 50px;
  border-radius: 12px;
  border-width: 1.5px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.colors.blue[700]};
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

export const DashedAddButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const GarageOwnerCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  border-width: 1px;
  border-color: #dbeafe;
  overflow: hidden;
`;

export const GarageImageBox = styled.View`
  width: 100%;
  height: 136px;
  position: relative;
  background-color: #cbd5e1;
`;

export const GarageCoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const GarageStatusPill = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(15, 23, 42, 0.82);
  border-radius: 999px;
  padding: 4px 12px;
`;

export const GarageStatusPillText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 11px;
  color: #86efac;
  include-font-padding: false;
`;

export const GarageBody = styled.View`
  padding: 14px;
  gap: 10px;
`;

export const GarageHeaderLine = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const GaragePriceText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.blue[800]};
  include-font-padding: false;
`;

export const GarageMetricsRow = styled.View`
  flex-direction: row;
  gap: 24px;
  border-top-width: 1px;
  border-top-color: #e2e8f0;
  padding-top: 10px;
`;

export const GarageMetricCol = styled.View`
  gap: 2px;
`;

export const GarageMetricLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.black[700]};
  include-font-padding: false;
`;

export const GarageGreenValue = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: #16a34a;
  include-font-padding: false;
`;

export const GarageDarkValue = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const ConfigRowCard = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: #dbeafe;
  padding: 14px 16px;
`;

export const LogoutSection = styled.View`
  margin-top: 24px;
  padding: 0 20px;
  align-items: center;
  gap: 10px;
`;

export const LogoutButton = styled.TouchableOpacity`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #fca5a5;
  background-color: #fef2f2;
  align-items: center;
  justify-content: center;
`;

export const LogoutButtonText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 15px;
  color: #dc2626;
  include-font-padding: false;
`;

export const AppVersionText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
  include-font-padding: false;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(15, 23, 42, 0.55);
  justify-content: flex-end;
`;

export const ModalSheet = styled.View`
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  max-height: 88%;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const ModalTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const FieldGroup = styled.View`
  margin-bottom: 12px;
  gap: 4px;
`;

export const FieldLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[900]};
  include-font-padding: false;
`;

export const FieldInput = styled.TextInput`
  height: 44px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #bfdbfe;
  background-color: #f8fbff;
  padding: 0 12px;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const SavePrimaryBtn = styled.TouchableOpacity`
  height: 48px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.blue[1000]};
  align-items: center;
  justify-content: center;
  margin-top: 6px;
`;

export const SavePrimaryBtnText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 15px;
  color: #ffffff;
  include-font-padding: false;
`;