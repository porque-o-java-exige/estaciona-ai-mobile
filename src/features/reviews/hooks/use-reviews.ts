import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import {
  CreateReviewRequest,
  DriverReviewResponse,
  GarageReviewResponse,
} from '../types/review.types';

export function useCreateGarageReview() {
  const queryClient = useQueryClient();

  return useMutation<GarageReviewResponse, unknown, CreateReviewRequest>({
    mutationFn: reviewService.createGarageReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['garage-rating'] });
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
}

export function useCreateDriverReview() {
  const queryClient = useQueryClient();

  return useMutation<DriverReviewResponse, unknown, CreateReviewRequest>({
    mutationFn: reviewService.createDriverReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
}