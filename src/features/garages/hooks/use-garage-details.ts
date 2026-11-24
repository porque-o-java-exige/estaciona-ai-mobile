import { useQuery } from '@tanstack/react-query';
import { garageService } from '../services/garage.service';
import { GarageDetail, GarageRating } from '../types/garage.types';

export function useGarageDetails(garageId?: string) {
  return useQuery<GarageDetail>({
    queryKey: ['garage-detail', garageId],
    enabled: Boolean(garageId),
    queryFn: () => garageService.getGarageById(garageId!),
  });
}

export function useGarageRating(garageId?: string) {
  return useQuery<GarageRating>({
    queryKey: ['garage-rating', garageId],
    enabled: Boolean(garageId),
    queryFn: () => garageService.getGarageRating(garageId!),
  });
}