import styled from 'styled-components/native';

export const Container = styled.View<{ $topInset: number }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[1100]};
  padding-top: ${({ $topInset }) => $topInset + 12}px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const GreetingWrapper = styled.View`
  flex: 1;
  padding-right: 12px;
`;

export const GreetingText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[700]};
  margin-bottom: 2px;
`;

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 20px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const IconSquareButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.white[300]};
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
`;

export const HeaderIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: ${({ theme }) => theme.colors.blue[1000]};
`;

export const SearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

export const SearchInputContainer = styled.View`
  flex: 1;
  height: 46px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.white[300]};
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  padding-left: 12px;
  padding-right: 12px;
`;

export const SearchIcon = styled.Image`
  width: 18px;
  height: 18px;
  tint-color: #94a3b8;
  margin-right: 8px;
`;

export const SearchTextInput = styled.TextInput`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black[1100]};
`;

export const MapWrapper = styled.View<{ $bottomInset: number }>`
  flex: 1;
  border-radius: 20px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.white[300]};
  margin-bottom: ${({ $bottomInset }) => Math.max($bottomInset, 12)}px;
`;

export const PinImage = styled.Image`
  width: 34px;
  height: 34px;
`;

export const RecenterButton = styled.TouchableOpacity`
  position: absolute;
  top: 14px;
  right: 14px;
  background-color: #ffffff;
  padding: 8px 12px;
  border-radius: 20px;
  elevation: 4;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
`;

export const RecenterText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.blue[1000]};
`;