import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/use-auth-store';
import { userService } from '../services/user.service';
import {
  DriverRatingSummary,
  PublicUserProfile,
  UpdateUserRequest,
  UserResponse,
} from '../types/user.types';

export function useUserProfile(userId?: string) {
  return useQuery<PublicUserProfile>({
    queryKey: ['user-profile', userId],
    enabled: Boolean(userId),
    queryFn: () => userService.getUserById(userId!),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDriverRating(driverId?: string) {
  return useQuery<DriverRatingSummary>({
    queryKey: ['driver-rating', driverId],
    enabled: Boolean(driverId),
    queryFn: () => userService.getDriverRating(driverId!),
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    unknown,
    { userId: string; payload: UpdateUserRequest }
  >({
    mutationFn: ({ userId, payload }) => userService.update(userId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['user-profile', updated.id], updated);
      useAuthStore.setState((state) => ({
        user: state.user
          ? { ...state.user, name: updated.name, email: updated.email }
          : state.user,
      }));
    },
  });
}

export function useUpdateUserPhoto() {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    unknown,
    { userId: string; fileUri: string; mimeType?: string }
  >({
    mutationFn: ({ userId, fileUri, mimeType }) =>
      userService.updatePhoto(userId, fileUri, mimeType),
    onSuccess: (updated) => {
      queryClient.setQueryData(['user-profile', updated.id], updated);
    },
  });
}

export function useDeleteUserAccount() {
  return useMutation<void, unknown, string>({
    mutationFn: (userId) => userService.delete(userId),
  });
}