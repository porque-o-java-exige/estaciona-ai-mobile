import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import {
  EnrichedChatRoom,
  useEnrichedChatRooms,
} from '@/features/chat/hooks/use-chat';

import backArrowIconImg from '@assets/images/back-arrow-icon.png';
import * as S from './chat-rooms.styles';

const DEFAULT_USER_AVATAR =
  'https://estacionaaistorage.blob.core.windows.net/estaciona-ai-images/users/user.png';

function formatMessageTime(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function ChatRoomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const {
    data: rooms = [],
    isLoading,
    isRefetching,
    refetch,
  } = useEnrichedChatRooms();

  function handleOpenRoom(room: EnrichedChatRoom) {
    router.push({
      pathname: '/(main)/chat/[bookingId]',
      params: {
        bookingId: room.bookingId,
        roomId: room.roomId,
        otherUserId: room.otherUserId,
      },
    });
  }

  return (
    <S.Container $topInset={insets.top}>
      <S.HeaderRow>
        <S.BackButton
          onPress={() => router.replace('/(main)/(tabs)')}
          activeOpacity={0.75}
        >
          <S.BackArrowIcon source={backArrowIconImg} resizeMode="contain" />
        </S.BackButton>

        <S.HeaderTitle>Conversas</S.HeaderTitle>

        {rooms.length > 0 ? (
          <S.CountBadge>
            <S.CountBadgeText>{rooms.length}</S.CountBadgeText>
          </S.CountBadge>
        ) : null}
      </S.HeaderRow>

      <S.HeaderDivider />

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size="large" color={theme.colors.blue[1000]} />
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.roomId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 16) + 100,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                void refetch();
              }}
              tintColor={theme.colors.blue[1000]}
            />
          }
          ListEmptyComponent={
            <S.EmptyBox>
              <S.EmptyText>
                Você ainda não possui conversas ativas. Ao reservar uma vaga,
                uma sala de chat será criada automaticamente com o proprietário.
              </S.EmptyText>
            </S.EmptyBox>
          }
          renderItem={({ item }) => {
            const displayName =
              item.otherUser?.name ||
              `Usuário #${item.otherUserId.slice(0, 6)}`;
            const avatarUri = item.otherUser?.photoUrl || DEFAULT_USER_AVATAR;
            const previewText =
              item.lastMessage?.content || 'Toque para iniciar a conversa...';
            const timeLabel = formatMessageTime(
              item.lastMessage?.createdAt || item.createdAt
            );

            return (
              <S.RoomRow
                activeOpacity={0.75}
                onPress={() => handleOpenRoom(item)}
              >
                <S.AvatarContainer>
                  <S.AvatarImage
                    source={{ uri: avatarUri }}
                    resizeMode="cover"
                  />
                  <S.OnlineDot />
                </S.AvatarContainer>

                <S.RoomMiddle>
                  <S.RoomName>{displayName}</S.RoomName>
                  <S.RoomPreview>{previewText}</S.RoomPreview>
                </S.RoomMiddle>

                <S.RoomRight>
                  {timeLabel ? <S.TimeText>{timeLabel}</S.TimeText> : null}
                  {item.lastMessage ? (
                    <S.MessageCountPill>
                      <S.MessageCountText>1</S.MessageCountText>
                    </S.MessageCountPill>
                  ) : null}
                </S.RoomRight>
              </S.RoomRow>
            );
          }}
        />
      )}
    </S.Container>
  );
}