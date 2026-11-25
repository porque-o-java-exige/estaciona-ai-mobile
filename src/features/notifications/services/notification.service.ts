import { api } from '@/lib/axios';
import { NotificationItem } from '../types/notification.types';

export const notificationService = {
  async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    const { data } = await api.get<NotificationItem[]>(
      `/notifications/user/${userId}`
    );
    return Array.isArray(data) ? data : [];
  },

  async markAsRead(notificationId: string): Promise<void> {
    await api.patch(`/notifications/${notificationId}/read`);
  },
};