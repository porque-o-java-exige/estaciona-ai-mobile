import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { garageService } from '../services/garage.service';
import { Coordinates, GarageNearbyItem } from '../types/garage.types';

export function useNearbyGarages(center: Coordinates | null, radius = 2) {
  return useQuery<GarageNearbyItem[]>({
    queryKey: [
      'nearby-garages',
      center?.latitude.toFixed(4),
      center?.longitude.toFixed(4),
      radius,
    ],
    enabled: Boolean(center),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
    queryFn: () => {
      if (!center) {
        return Promise.resolve([]);
      }

      return garageService.getNearbyGarages({
        lat: center.latitude,
        lng: center.longitude,
        radius,
      });
    },
  });
}