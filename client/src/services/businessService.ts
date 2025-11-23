import api from '../utils/api';

export interface BusinessProfileRequest {
  businessName: string;
  description?: string;
  website?: string;
  logo?: string;
}

export const businessService = {
  createProfile: async (data: BusinessProfileRequest) => {
    const response = await api.post('/business/profiles', data);
    return response.data;
  },

  getAllProfiles: async () => {
    const response = await api.get('/business/profiles');
    return response.data;
  },

  getProfile: async (businessId: number) => {
    const response = await api.get(`/business/profiles/${businessId}`);
    return response.data;
  },
};




