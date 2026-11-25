import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/use-auth-store';
import { notificationService } from '../services/notification.service';
import { NotificationItem } from '../types/notification.types';

export function useUserNotifications() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery<NotificationItem[]>({
    queryKey: ['notifications', userId],
    enabled: Boolean(userId),
    queryFn: () => notificationService.getUserNotifications(userId!),
    refetchInterval: 8000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}