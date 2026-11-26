import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { PublicUserProfile } from '../types/user.types';

export function useUserProfile(userId?: string) {
  return useQuery<PublicUserProfile>({
    queryKey: ['user-profile', userId],
    enabled: Boolean(userId),
    queryFn: () => userService.getUserById(userId!),
    staleTime: 1000 * 60 * 10,
  });
}