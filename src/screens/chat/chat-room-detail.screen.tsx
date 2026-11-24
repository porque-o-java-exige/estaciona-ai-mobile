import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import {
  useOpenBookingChat,
  useRoomMessages,
  useSendChatMessage,
} from '@/features/chat/hooks/use-chat';
import { useAuthStore } from '@/stores/use-auth-store';

export default function ChatRoomDetailScreen() {
  const { bookingId, roomId: initialRoomId } = useLocalSearchParams<{
    bookingId: string;
    roomId?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);

  const [resolvedRoomId, setResolvedRoomId] = useState<string | undefined>(
    initialRoomId
  );
  const [text, setText] = useState('');

  const { mutateAsync: ensureRoom } = useOpenBookingChat();
  const { data: messages = [], isLoading } = useRoomMessages(resolvedRoomId);
  const { mutateAsync: sendMessage, isPending: isSending } = useSendChatMessage(
    resolvedRoomId ?? ''
  );

  useEffect(() => {
    if (!resolvedRoomId && bookingId) {
      void ensureRoom(bookingId).then((room) => setResolvedRoomId(room.roomId));
    }
  }, [resolvedRoomId, bookingId, ensureRoom]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || !resolvedRoomId) return;

    try {
      setText('');
      await sendMessage(trimmed);
    } catch {
      Alert.alert(
        'Erro ao enviar',
        'Não foi possível enviar a mensagem agora.'
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.white[1100] }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 12,
          paddingHorizontal: 20,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={{
              fontFamily: theme.fonts.medium,
              fontSize: 15,
              color: theme.colors.blue[1000],
            }}
          >
            Voltar
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 16,
            color: theme.colors.black[1100],
          }}
        >
          Chat da Reserva #{bookingId?.slice(0, 8)}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {isLoading || !resolvedRoomId ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size="large" color={theme.colors.blue[1000]} />
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.messageId}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                fontFamily: theme.fonts.regular,
                fontSize: 13,
                color: theme.colors.black[700],
                marginTop: 24,
              }}
            >
              Sala criada! Envie a primeira mensagem para iniciar a conversa.
            </Text>
          }
          renderItem={({ item }) => {
            const isMine = item.senderId === user?.id;
            return (
              <View
                style={{
                  alignSelf: isMine ? 'flex-end' : 'flex-start',
                  backgroundColor: isMine
                    ? theme.colors.blue[1000]
                    : '#FFFFFF',
                  borderWidth: isMine ? 0 : 1,
                  borderColor: '#E2E8F0',
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  maxWidth: '80%',
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.regular,
                    fontSize: 14,
                    color: isMine ? '#FFFFFF' : theme.colors.black[1100],
                  }}
                >
                  {item.content}
                </Text>
              </View>
            );
          }}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 14),
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
        }}
      >
        <TextInput
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#94A3B8"
          value={text}
          onChangeText={setText}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: '#CBD5E1',
            paddingHorizontal: 16,
            fontFamily: theme.fonts.regular,
            fontSize: 14,
            color: theme.colors.black[1100],
          }}
        />
        <TouchableOpacity
          disabled={isSending || !text.trim()}
          onPress={() => {
            void handleSend();
          }}
          style={{
            height: 44,
            paddingHorizontal: 18,
            borderRadius: 22,
            backgroundColor: theme.colors.blue[1000],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.bold,
              fontSize: 14,
              color: '#FFFFFF',
            }}
          >
            Enviar
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}