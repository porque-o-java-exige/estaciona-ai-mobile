import { ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import homeIconImg from '@assets/images/home-icon.png';
import bookingIconImg from '@assets/images/booking-icon.png';
import paymentIconImg from '@assets/images/payment-icon.png';
import chatIconImg from '@assets/images/chat-icon.png';
import profileIconImg from '@assets/images/profile-icon.png';
import * as S from './bottom-tab-bar.styles';

interface TabRoute {
  key: string;
  name: string;
}

export interface CustomTabBarProps {
  state: {
    index: number;
    routes: ReadonlyArray<TabRoute>;
  };
  emitter: {
    emit: (options: {
      type: 'tabPress';
      target?: string;
      canPreventDefault: true;
    }) => { defaultPrevented?: boolean };
  };
  navigateToTab: (routeKey: string) => void;
  insets?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface TabConfig {
  name: string;
  label: string;
  icon: ImageSourcePropType;
}

const TAB_ITEMS: TabConfig[] = [
  { name: 'index', label: 'Início', icon: homeIconImg },
  { name: 'bookings', label: 'Reservas', icon: bookingIconImg },
  { name: 'payment', label: 'Pagamento', icon: paymentIconImg },
  { name: 'chat', label: 'Conversas', icon: chatIconImg },
  { name: 'profile', label: 'Perfil', icon: profileIconImg },
];

export function BottomTabBar({
  state,
  emitter,
  navigateToTab,
  insets: tabInsets,
}: CustomTabBarProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const bottomInset = tabInsets?.bottom ?? safeAreaInsets.bottom;
  const activeRouteName = state.routes[state.index]?.name;

  return (
    <S.Wrapper $bottomInset={bottomInset}>
      {TAB_ITEMS.map((item) => {
        const route = state.routes.find((r) => r.name === item.name);
        if (!route) return null;

        const isFocused = activeRouteName === item.name;

        const onPress = () => {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        return (
          <S.TabItemButton
            key={item.name}
            onPress={onPress}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <S.IconPill $active={isFocused}>
              <S.TabIcon
                source={item.icon}
                $active={isFocused}
                resizeMode="contain"
              />
            </S.IconPill>
            <S.TabLabel $active={isFocused}>{item.label}</S.TabLabel>
          </S.TabItemButton>
        );
      })}
    </S.Wrapper>
  );
}