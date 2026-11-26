export interface VehicleResponse {
  id: string;
  ownerId: string;
  licensePlate: string;
  year: number;
  brand: string;
  model: string;
  color: string;
}

export interface VehicleRequest {
  licensePlate: string;
  year: number;
  brand: string;
  model: string;
  color: string;
}