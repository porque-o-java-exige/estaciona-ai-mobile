export type UUID = string;

export interface AuthenticatedUser {
  id: UUID;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface ChatRoomResponse {
  roomId: UUID;
  bookingId: UUID;
  driverId: UUID;
  ownerId: UUID;
  createdAt: string;
}

export interface ChatMessageResponse {
  messageId: UUID;
  roomId: UUID;
  senderId: UUID;
  content: string;
  createdAt: string;
}