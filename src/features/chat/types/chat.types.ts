export interface ChatRoomResponse {
  roomId: string;
  bookingId: string;
  driverId: string;
  ownerId: string;
  createdAt: string;
}

export interface ChatMessageResponse {
  messageId: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface SendMessageRequest {
  roomId: string;
  content: string;
}