import { api } from '@/lib/axios';
import {
  ChatMessageResponse,
  ChatRoomResponse,
  SendMessageRequest,
} from '../types/chat.types';

export const chatService = {
  async getOrCreateRoomForBooking(
    bookingId: string
  ): Promise<ChatRoomResponse> {
    const { data } = await api.post<ChatRoomResponse>(
      `/chat/booking/${bookingId}`
    );
    return data;
  },

  async getUserRooms(): Promise<ChatRoomResponse[]> {
    const { data } = await api.get<ChatRoomResponse[]>('/chat/rooms');
    return data;
  },

  async getRoomMessages(roomId: string): Promise<ChatMessageResponse[]> {
    const { data } = await api.get<ChatMessageResponse[]>(
      `/chat/rooms/${roomId}/messages`
    );
    return data;
  },

  async sendMessage(payload: SendMessageRequest): Promise<ChatMessageResponse> {
    const { data } = await api.post<ChatMessageResponse>(
      '/chat/messages',
      payload
    );
    return data;
  },
};