import styled from 'styled-components/native';

export const Container = styled.View<{ $topInset: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[1100]};
  padding-top: ${({ $topInset }) => $topInset + 12}px;
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
`;

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const IconSquareButton = styled.TouchableOpacity<{ $active?: boolean }>`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background-color: ${({ $active }) => ($active ? '#DBEAFE' : '#FFFFFF')};
  border-width: 1px;
  border-color: ${({ $active, theme }) =>
    $active ? theme.colors.blue[1000] : '#CBD5E1'};
  align-items: center;
  justify-content: center;
  position: relative;
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

export const HeaderIcon = styled.Image`
  width: 19px;
  height: 19px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
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
  height: 44px;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-width: 1px;
  border-color: #cbd5e1;
  border-radius: 12px;
  padding: 0 12px;
`;

export const SearchIcon = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
  margin-right: 8px;
`;

export const SearchTextInput = styled.TextInput`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const ClearSearchButton = styled.TouchableOpacity`
  padding: 4px 6px;
`;

export const ClearSearchText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 13px;
  color: #94a3b8;
`;

export const MainScroll = styled.ScrollView.attrs<{ $bottomInset: number }>(
  ({ $bottomInset }) => ({
    contentContainerStyle: {
      paddingHorizontal: 20,
      paddingBottom: $bottomInset + 100,
    },
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: 'handled',
  })
)<{ $bottomInset: number }>``;

export const MapWrapper = styled.View`
  height: 410px;
  border-radius: 16px;
  overflow: hidden;
  border-width: 1px;
  border-color: #cbd5e1;
  background-color: #e2e8f0;
  margin-bottom: 20px;
`;

export const PinImage = styled.Image`
  width: 34px;
  height: 42px;
`;

export const RecenterButton = styled.TouchableOpacity`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #ffffff;
  padding: 8px 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #cbd5e1;
  elevation: 3;
`;

export const RecenterText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const ResultsSectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const ResultsSectionTitle = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 17px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const ResultsCountText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[1000]};
  margin-left: 8px;
`;

export const GarageCardsList = styled.View`
  gap: 12px;
`;

export const GarageCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: #e2e8f0;
  padding: 10px;
  gap: 12px;
  elevation: 2;
  shadow-color: #0f172a;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
`;

export const GarageCardThumb = styled.Image`
  width: 76px;
  height: 76px;
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
  margin-bottom: 2px;
`;

export const GarageCardTitle = styled.Text.attrs({
  numberOfLines: 1,
})`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const SpotsBadge = styled.View<{ $available: boolean }>`
  padding: 2px 8px;
  border-radius: 999px;
  background-color: ${({ $available }) => ($available ? '#DBEAFE' : '#FEE2E2')};
`;

export const SpotsBadgeText = styled.Text<{ $available: boolean }>`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 10px;
  color: ${({ $available, theme }) =>
    $available ? theme.colors.blue[1000] : '#DC2626'};
`;

export const GarageCardAddress = styled.Text.attrs({
  numberOfLines: 1,
})`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-bottom: 8px;
`;

export const GarageCardBottomRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const GarageMetaRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const MiniStarIcon = styled.Image`
  width: 12px;
  height: 12px;
  tint-color: #f59e0b;
`;

export const GarageMetaBold = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.black[900]};
`;

export const GarageMetaMuted = styled.Text.attrs({
  numberOfLines: 1,
})`
  flex-shrink: 1;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 11px;
  color: #94a3b8;
`;

export const GarageCardPrice = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const EmptyResultsBox = styled.View`
  background-color: #ffffff;
  border-radius: 14px;
  border-width: 1px;
  border-color: #e2e8f0;
  padding: 18px;
  align-items: center;
`;

export const EmptyResultsText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black[700]};
  text-align: center;
`;

/* Modal de Filtros */
export const FilterBackdrop = styled.View`
  flex: 1;
  background-color: rgba(15, 23, 42, 0.52);
  justify-content: flex-end;
`;

export const FilterSheet = styled.View<{ $bottomInset: number }>`
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px 20px ${({ $bottomInset }) => Math.max($bottomInset, 20)}px;
`;

export const FilterHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const FilterTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const ResetFilterText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const FilterSectionLabel = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[900]};
  margin-bottom: 8px;
`;

export const FilterChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const FilterChip = styled.TouchableOpacity<{ $selected: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  border-width: 1px;
  border-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.blue[1000] : '#CBD5E1'};
  background-color: ${({ $selected }) => ($selected ? '#DBEAFE' : '#FFFFFF')};
`;

export const FilterChipText = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.blue[1000] : theme.colors.black[900]};
`;

export const FilterActionsRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 6px;
`;