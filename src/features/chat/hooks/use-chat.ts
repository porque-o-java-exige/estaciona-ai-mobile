import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { userService } from '@/features/users/services/user.service';
import { PublicUserProfile } from '@/features/users/types/user.types';
import { useAuthStore } from '@/stores/use-auth-store';
import { chatService } from '../services/chat.service';
import {
  ChatMessageResponse,
  ChatRoomResponse,
  SendMessageRequest,
} from '../types/chat.types';

export interface EnrichedChatRoom extends ChatRoomResponse {
  otherUserId: string;
  otherUser?: PublicUserProfile;
  lastMessage?: ChatMessageResponse;
}

export function useChatRooms() {
  return useQuery<ChatRoomResponse[]>({
    queryKey: ['chat-rooms'],
    queryFn: chatService.getUserRooms,
    refetchInterval: 8000,
  });
}

export function useEnrichedChatRooms() {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const roomsQuery = useChatRooms();
  const rooms = roomsQuery.data ?? [];

  const roomsWithPeer = rooms.map((room) => {
    const otherUserId =
      room.driverId === currentUserId ? room.ownerId : room.driverId;
    return { ...room, otherUserId };
  });

  const uniquePeerIds = Array.from(
    new Set(roomsWithPeer.map((r) => r.otherUserId).filter(Boolean))
  );

  const userQueries = useQueries({
    queries: uniquePeerIds.map((userId) => ({
      queryKey: ['user-profile', userId],
      queryFn: () => userService.getUserById(userId),
      staleTime: 1000 * 60 * 10,
    })),
  });

  const messagesQueries = useQueries({
    queries: roomsWithPeer.map((room) => ({
      queryKey: ['chat-messages', room.roomId],
      queryFn: () => chatService.getRoomMessages(room.roomId),
      refetchInterval: 6000,
    })),
  });

  const userMap = new Map<string, PublicUserProfile>();
  uniquePeerIds.forEach((id, idx) => {
    const profile = userQueries[idx]?.data;
    if (profile) userMap.set(id, profile);
  });

  const enriched: EnrichedChatRoom[] = roomsWithPeer.map((room, idx) => {
    const msgs = messagesQueries[idx]?.data ?? [];
    const lastMessage = msgs.length > 0 ? msgs[msgs.length - 1] : undefined;
    return {
      ...room,
      otherUser: userMap.get(room.otherUserId),
      lastMessage,
    };
  });

  return {
    ...roomsQuery,
    data: enriched,
  };
}

export function useRoomMessages(roomId?: string) {
  return useQuery<ChatMessageResponse[]>({
    queryKey: ['chat-messages', roomId],
    enabled: Boolean(roomId),
    queryFn: () => chatService.getRoomMessages(roomId!),
    refetchInterval: 3000,
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
    onSuccess: (saved) => {
      queryClient.setQueryData<ChatMessageResponse[]>(
        ['chat-messages', roomId],
        (prev = []) => {
          if (prev.some((m) => m.messageId === saved.messageId)) return prev;
          return [...prev, saved];
        }
      );
      void queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
  });
}