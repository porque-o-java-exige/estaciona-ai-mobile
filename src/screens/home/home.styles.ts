import styled from 'styled-components/native';

export const Container = styled.View<{ $topInset: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[1100]};
  padding-top: ${({ $topInset }) => $topInset + 10}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 14px;
`;

export const GreetingWrapper = styled.View`
  flex: 1;
  padding-right: 12px;
`;

export const GreetingText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-bottom: 2px;
  include-font-padding: false;
`;

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const IconSquareButton = styled.TouchableOpacity<{ $active?: boolean }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ $active, theme }) =>
    $active ? theme.colors.blue[1000] : theme.colors.white[300]};
  background-color: ${({ $active }) => ($active ? '#DBEAFE' : '#FFFFFF')};
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const HeaderIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const FilterBadgeDot = styled.View`
  position: absolute;
  top: 7px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const SearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
  margin-bottom: 14px;
`;

export const SearchInputContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  height: 44px;
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.white[300]};
  padding: 0 12px;
  gap: 8px;
`;

export const SearchIcon = styled.Image`
  width: 17px;
  height: 17px;
  tint-color: ${({ theme }) => theme.colors.blue[900]};
`;

export const SearchTextInput = styled.TextInput`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[1100]};
  padding: 0;
  include-font-padding: false;
`;

export const ClearSearchButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const ClearSearchText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[600]};
`;

export const MainScroll = styled.ScrollView.attrs<{ $bottomInset: number }>(
  ({ $bottomInset }) => ({
    contentContainerStyle: {
      paddingHorizontal: 20,
      paddingBottom: $bottomInset + 105,
    },
    showsVerticalScrollIndicator: false,
  })
)<{ $bottomInset: number }>``;

export const MapWrapper = styled.View`
  height: 460px;
  border-radius: 16px;
  overflow: hidden;
  border-width: 1px;
  border-color: #cbd5e1;
  background-color: #e2e8f0;
  margin-bottom: 20px;
`;

export const PinImage = styled.Image`
  width: 14px;
  height: 14px;
`;

export const RecenterButton = styled.TouchableOpacity`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.white[300]};
  padding: 7px 11px;
  elevation: 3;
`;

export const RecenterText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const ResultsSectionHeader = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const ResultsSectionTitle = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.black[1100]};
  padding-right: 12px;
  include-font-padding: false;
`;

export const ResultsCountText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[900]};
  include-font-padding: false;
`;

export const EmptyResultsBox = styled.View`
  background-color: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.white[300]};
  padding: 20px;
  align-items: center;
`;

export const EmptyResultsText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[700]};
  text-align: center;
  include-font-padding: false;
`;

export const GarageCardsList = styled.View`
  gap: 12px;
`;

export const GarageCard = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.white[300]};
  padding: 10px;
  gap: 12px;
  elevation: 2;
  shadow-color: #0f172a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
`;

export const GarageCardThumb = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background-color: #1e293b;
`;

export const GarageCardBody = styled.View`
  flex: 1;
  justify-content: space-between;
`;

export const GarageCardTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const GarageCardTitle = styled.Text.attrs({
  numberOfLines: 1,
})`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const SpotsBadge = styled.View<{ $available: boolean }>`
  padding: 2px 8px;
  border-radius: 999px;
  background-color: ${({ $available }) => ($available ? '#DBEAFE' : '#FEE2E2')};
  align-items: center;
  justify-content: center;
`;

export const SpotsBadgeText = styled.Text<{ $available: boolean }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 11px;
  color: ${({ $available, theme }) =>
    $available ? theme.colors.blue[1000] : '#DC2626'};
  include-font-padding: false;
`;

export const GarageCardAddress = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin: 2px 0;
  include-font-padding: false;
`;

export const GarageCardBottomRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

export const GarageMetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: 8px;
`;

export const MiniStarIcon = styled.Image`
  width: 12px;
  height: 12px;
  tint-color: #f59e0b;
  margin-right: 3px;
`;

export const GarageMetaBold = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[1000]};
  include-font-padding: false;
`;

export const GarageMetaMuted = styled.Text.attrs({
  numberOfLines: 1,
})`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-left: 4px;
  include-font-padding: false;
`;

export const GarageCardPrice = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  include-font-padding: false;
`;

export const FilterBackdrop = styled.View`
  flex: 1;
  background-color: rgba(15, 23, 42, 0.52);
  justify-content: flex-end;
`;

export const FilterSheet = styled.View<{ $bottomInset: number }>`
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 22px 20px ${({ $bottomInset }) => Math.max($bottomInset, 20)}px;
`;

export const FilterHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

export const FilterTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black[1100]};
  include-font-padding: false;
`;

export const ResetFilterText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.blue[900]};
  include-font-padding: false;
`;

export const FilterSectionLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[900]};
  margin-bottom: 10px;
  include-font-padding: false;
`;

export const FilterChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
`;

export const FilterChip = styled.TouchableOpacity<{ $selected: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  border-width: 1px;
  border-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.blue[1000] : theme.colors.white[300]};
  background-color: ${({ $selected }) => ($selected ? '#DBEAFE' : '#FFFFFF')};
  align-items: center;
  justify-content: center;
`;

export const FilterChipText = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.blue[1000] : theme.colors.black[800]};
  include-font-padding: false;
`;

export const FilterActionsRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 4px;
`;