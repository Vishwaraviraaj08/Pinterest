import api from '../utils/api';
import { BusinessProfileRequest, BusinessProfileResponse } from '../types';

export const businessService = {
  async createBusinessProfile(profileData: BusinessProfileRequest): Promise<BusinessProfileResponse> {
    const response = await api.post<BusinessProfileResponse>('/business/profiles', profileData);
    return response.data;
  },

  async getAllBusinessProfiles(): Promise<BusinessProfileResponse[]> {
    const response = await api.get<BusinessProfileResponse[]>('/business/profiles');
    return response.data;
  },

  async getBusinessProfile(businessId: string): Promise<BusinessProfileResponse> {
    const response = await api.get<BusinessProfileResponse>(`/business/profiles/${businessId}`);
    return response.data;
  },

  async updateBusinessProfile(businessId: string, profileData: BusinessProfileRequest): Promise<BusinessProfileResponse> {
    const response = await api.put<BusinessProfileResponse>(`/business/profiles/${businessId}`, profileData);
    return response.data;
  },
};

export default businessService;
