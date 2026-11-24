export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GarageNearbyItem {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerHour: number | null;
  pricePerDay: number | null;
  available: boolean;
  distanceInKm: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface GarageDetail {
  garageId: string;
  ownerId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  features: string[];
  price: number | null;
  pricePerHour: number | null;
  pricePerDay: number | null;
  available: boolean;
  coverImageUrl: string | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GarageRating {
  garageId: string;
  averageRating: number;
  totalReviews: number;
}

export interface NearbyGaragesParams {
  lat: number;
  lng: number;
  radius?: number;
  page?: number;
  size?: number;
}