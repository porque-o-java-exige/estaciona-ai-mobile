import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { useQueryClient } from '@tanstack/react-query';

import { env } from '@/config/env';
import {
  useOpenBookingChat,
  useRoomMessages,
  useSendChatMessage,
} from '@/features/chat/hooks/use-chat';
import { ChatMessageResponse } from '@/features/chat/types/chat.types';
import { useUserProfile } from '@/features/users/hooks/use-users';
import { useAuthStore } from '@/stores/use-auth-store';

import backArrowIconImg from '@assets/images/back-arrow-icon.png';
import sendMessageIconImg from '@assets/images/send-message-icon.png';
import * as S from './chat-room-detail.styles';

const DEFAULT_USER_AVATAR =
  'https://estacionaaistorage.blob.core.windows.net/estaciona-ai-images/users/user.png';

export default function ChatRoomDetailScreen() {
  const {
    bookingId,
    roomId: paramRoomId,
    otherUserId: paramOtherUserId,
  } = useLocalSearchParams<{
    bookingId: string;
    roomId?: string;
    otherUserId?: string;
  }>();

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const currentUserId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.token);

  const [resolvedRoomId, setResolvedRoomId] = useState<string | undefined>(
    paramRoomId
  );
  const [resolvedOtherUserId, setResolvedOtherUserId] = useState<
    string | undefined
  >(paramOtherUserId);
  const [draftText, setDraftText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const flatListRef = useRef<FlatList<ChatMessageResponse> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const { mutateAsync: ensureRoom } = useOpenBookingChat();
  const { data: messages = [], isLoading: isLoadingMessages } =
    useRoomMessages(resolvedRoomId);
  const { data: peerProfile } = useUserProfile(resolvedOtherUserId);
  const { mutateAsync: sendMessageRest } = useSendChatMessage(
    resolvedRoomId ?? ''
  );

  useEffect(() => {
    let mounted = true;

    async function loadRoom() {
      if (resolvedRoomId && resolvedOtherUserId) return;
      if (!bookingId) return;

      try {
        const room = await ensureRoom(bookingId);
        if (!mounted) return;
        setResolvedRoomId(room.roomId);
        const peerId =
          room.driverId === currentUserId ? room.ownerId : room.driverId;
        setResolvedOtherUserId(peerId);
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar esta sala de chat.');
      }
    }

    void loadRoom();
    return () => {
      mounted = false;
    };
  }, [
    bookingId,
    resolvedRoomId,
    resolvedOtherUserId,
    currentUserId,
    ensureRoom,
  ]);

  useEffect(() => {
    if (!resolvedRoomId || !token || !env.apiUrl) return;

    const wsBase = env.apiUrl
      .replace(/^http:\/\//i, 'ws://')
      .replace(/^https:\/\//i, 'wss://')
      .replace(/\/$/, '');

    const ws = new WebSocket(`${wsBase}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      const connectFrame = `CONNECT\nAuthorization:Bearer ${token}\naccept-version:1.2\nheart-beat:10000,10000\n\n\0`;
      ws.send(connectFrame);
    };

    ws.onmessage = (event) => {
      const raw = String(event.data || '');

      if (raw.startsWith('CONNECTED')) {
        const subFrame = `SUBSCRIBE\nid:sub-${resolvedRoomId}\ndestination:/topic/room.${resolvedRoomId}\n\n\0`;
        ws.send(subFrame);
        return;
      }

      if (raw.startsWith('MESSAGE')) {
        const bodyStart = raw.indexOf('\n\n');
        if (bodyStart !== -1) {
          const jsonText = raw.slice(bodyStart + 2).replace(/\0/g, '').trim();
          try {
            const incoming = JSON.parse(jsonText) as ChatMessageResponse;
            if (incoming?.messageId) {
              queryClient.setQueryData<ChatMessageResponse[]>(
                ['chat-messages', resolvedRoomId],
                (prev = []) => {
                  if (prev.some((m) => m.messageId === incoming.messageId)) {
                    return prev;
                  }
                  return [...prev, incoming];
                }
              );
              void queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
            }
          } catch {
            // Ignora frames que não sejam JSON
          }
        }
      }
    };

    return () => {
      try {
        ws.close();
      } catch {
        // Ignora erro ao fechar socket
      }
      wsRef.current = null;
    };
  }, [resolvedRoomId, token, queryClient]);

  async function handleSend() {
    const content = draftText.trim();
    if (!content || !resolvedRoomId || isSending) return;

    setDraftText('');
    setIsSending(true);

    try {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({
          roomId: resolvedRoomId,
          content,
        });
        const sendFrame = `SEND\ndestination:/app/chat.send\ncontent-type:application/json\n\n${payload}\0`;
        ws.send(sendFrame);

        const optimistic: ChatMessageResponse = {
          messageId: `temp-${Date.now()}`,
          roomId: resolvedRoomId,
          senderId: currentUserId || '',
          content,
          createdAt: new Date().toISOString(),
        };
        queryClient.setQueryData<ChatMessageResponse[]>(
          ['chat-messages', resolvedRoomId],
          (prev = []) => [...prev, optimistic]
        );
        void queryClient.invalidateQueries({
          queryKey: ['chat-messages', resolvedRoomId],
        });
      } else {
        await sendMessageRest(content);
      }
    } catch {
      setDraftText(content);
      Alert.alert(
        'Falha ao enviar',
        'Não foi possível enviar a mensagem agora.'
      );
    } finally {
      setIsSending(false);
    }
  }

  const peerName = peerProfile?.name || 'Conversa';
  const peerAvatarUri = peerProfile?.photoUrl || DEFAULT_USER_AVATAR;

  return (
    <S.Container
      $topInset={insets.top}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <S.HeaderRow>
        <S.BackButton onPress={() => router.back()} activeOpacity={0.75}>
          <S.BackArrowIcon source={backArrowIconImg} resizeMode="contain" />
        </S.BackButton>

        <S.PeerAvatarWrapper>
          <S.PeerAvatar source={{ uri: peerAvatarUri }} resizeMode="cover" />
          <S.PeerOnlineDot />
        </S.PeerAvatarWrapper>

        <S.PeerName>{peerName}</S.PeerName>
      </S.HeaderRow>

      <S.HeaderDivider />

      {isLoadingMessages && !resolvedRoomId ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size="large" color={theme.colors.blue[1000]} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.messageId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 16,
          }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <View style={{ paddingVertical: 32, alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: theme.fonts.regular,
                  fontSize: 13,
                  color: theme.colors.black[700],
                  textAlign: 'center',
                  includeFontPadding: false,
                }}
              >
                Nenhuma mensagem ainda. Envie uma mensagem abaixo para
                combinar os detalhes da vaga.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isMine = item.senderId === currentUserId;
            return (
              <S.BubbleRow $isMine={isMine}>
                <S.MessageBubble $isMine={isMine}>
                  <S.MessageText>{item.content}</S.MessageText>
                </S.MessageBubble>
              </S.BubbleRow>
            );
          }}
        />
      )}

      <S.InputBarWrapper $bottomInset={insets.bottom}>
        <S.InputPill>
          <S.MessageInput
            placeholder="digite sua mensagem..."
            placeholderTextColor="#94A3B8"
            value={draftText}
            onChangeText={setDraftText}
            returnKeyType="send"
            onSubmitEditing={() => {
              void handleSend();
            }}
          />

          <S.SendButton
            disabled={!draftText.trim() || isSending}
            $disabled={!draftText.trim() || isSending}
            activeOpacity={0.75}
            onPress={() => {
              void handleSend();
            }}
          >
            <S.SendIcon source={sendMessageIconImg} resizeMode="contain" />
          </S.SendButton>
        </S.InputPill>
      </S.InputBarWrapper>
    </S.Container>
  );
}