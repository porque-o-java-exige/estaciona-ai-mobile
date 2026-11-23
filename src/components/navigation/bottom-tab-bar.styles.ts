import styled from 'styled-components/native';

export const Wrapper = styled.View<{ $bottomInset: number }>`
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: ${({ $bottomInset }) => Math.max($bottomInset, 12) + 12}px;
  background-color: #ffffff;
  border-radius: 32px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  elevation: 8;
  shadow-color: #000000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
`;

export const TabItemButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 2px 0;
`;

export const IconPill = styled.View<{ $active: boolean }>`
  width: 50px;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $active }) => ($active ? '#DBEAFE' : 'transparent')};
  margin-bottom: 4px;
`;

export const TabIcon = styled.Image<{ $active: boolean }>`
  width: 20px;
  height: 20px;
  tint-color: ${({ $active, theme }) =>
    $active ? theme.colors.blue[1000] : '#94A3B8'};
`;

export const TabLabel = styled.Text<{ $active: boolean }>`
  font-family: ${({ theme, $active }) =>
    $active ? theme.fonts.medium : theme.fonts.regular};
  font-size: 11px;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.blue[1000] : '#94A3B8'};
`;