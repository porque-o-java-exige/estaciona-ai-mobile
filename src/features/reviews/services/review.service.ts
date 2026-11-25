import { api } from '@/lib/axios';
import {
  CreateReviewRequest,
  DriverReviewResponse,
  GarageReviewResponse,
} from '../types/review.types';

export const reviewService = {
  async createGarageReview(
    payload: CreateReviewRequest
  ): Promise<GarageReviewResponse> {
    const { data } = await api.post<GarageReviewResponse>(
      '/garages/reviews',
      payload
    );
    return data;
  },

  async createDriverReview(
    payload: CreateReviewRequest
  ): Promise<DriverReviewResponse> {
    const { data } = await api.post<DriverReviewResponse>(
      '/drivers/reviews',
      payload
    );
    return data;
  },
};