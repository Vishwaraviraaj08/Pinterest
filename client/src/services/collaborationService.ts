import api from '../utils/api';
import { InvitationRequest, InvitationResponse, ConnectionResponse } from '../types';

export const collaborationService = {
  
  createInvitation: async (data: InvitationRequest): Promise<InvitationResponse> => {
    const response = await api.post<InvitationResponse>('/collaboration/invitations', data);
    return response.data;
  },

  getInvitations: async (userId: number): Promise<InvitationResponse[]> => {
    const response = await api.get<InvitationResponse[]>(`/collaboration/invitations/user/${userId}`);
    return response.data;
  },

  respondToInvitation: async (invitationId: number, response: string): Promise<InvitationResponse> => {
    const result = await api.put<InvitationResponse>(`/collaboration/invitations/${invitationId}/respond?response=${response}`);
    return result.data;
  },

  
  followUser: async (followingId: number): Promise<ConnectionResponse> => {
    const response = await api.post<ConnectionResponse>(`/collaboration/connections/follow/${followingId}`);
    return response.data;
  },

  unfollowUser: async (followingId: number): Promise<void> => {
    await api.delete(`/collaboration/connections/unfollow/${followingId}`);
  },

  getFollowers: async (userId: number): Promise<ConnectionResponse[]> => {
    const response = await api.get<ConnectionResponse[]>(`/collaboration/connections/followers/${userId}`);
    return response.data;
  },

  getFollowing: async (userId: number): Promise<ConnectionResponse[]> => {
    const response = await api.get<ConnectionResponse[]>(`/collaboration/connections/following/${userId}`);
    return response.data;
  },
};




