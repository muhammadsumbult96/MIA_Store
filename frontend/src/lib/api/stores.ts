import { apiClient } from "./client";

export interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  latitude?: string;
  longitude?: string;
  opening_hours?: string;
}

export const storesApi = {
  getStores: async (): Promise<Store[]> => {
    return apiClient.get<Store[]>("/stores");
  },
};

