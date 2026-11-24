import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import {
  ChatMessageResponse,
  ChatRoomResponse,
  SendMessageRequest,
} from '../types/chat.types';

export function useChatRooms() {
  return useQuery<ChatRoomResponse[]>({
    queryKey: ['chat-rooms'],
    queryFn: chatService.getUserRooms,
    refetchInterval: 5000,
  });
}

export function useRoomMessages(roomId?: string) {
  return useQuery<ChatMessageResponse[]>({
    queryKey: ['chat-messages', roomId],
    enabled: Boolean(roomId),
    queryFn: () => chatService.getRoomMessages(roomId!),
    refetchInterval: 3500,
  });
}

export function useOpenBookingChat() {
  const queryClient = useQueryClient();

  return useMutation<ChatRoomResponse, unknown, string>({
    mutationFn: chatService.getOrCreateRoomForBooking,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
  });
}

export function useSendChatMessage(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation<ChatMessageResponse, unknown, string>({
    mutationFn: (content) =>
      chatService.sendMessage({ roomId, content } satisfies SendMessageRequest),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['chat-messages', roomId] });
      void queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
  });
}