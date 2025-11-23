import api from '../utils/api';

export interface InvitationRequest {
  inviteeId: number;
  boardId?: number;
  invitationType: string;
}

export const collaborationService = {
  // Invitations
  createInvitation: async (data: InvitationRequest) => {
    const response = await api.post('/collaboration/invitations', data);
    return response.data;
  },

  getInvitations: async (userId: number) => {
    const response = await api.get(`/collaboration/invitations/user/${userId}`);
    return response.data;
  },

  respondToInvitation: async (invitationId: number, response: string) => {
    const result = await api.put(`/collaboration/invitations/${invitationId}/respond?response=${response}`);
    return result.data;
  },

  // Connections
  followUser: async (followingId: number) => {
    const response = await api.post(`/collaboration/connections/follow/${followingId}`);
    return response.data;
  },

  unfollowUser: async (followingId: number) => {
    await api.delete(`/collaboration/connections/unfollow/${followingId}`);
  },

  getFollowers: async (userId: number) => {
    const response = await api.get(`/collaboration/connections/followers/${userId}`);
    return response.data;
  },

  getFollowing: async (userId: number) => {
    const response = await api.get(`/collaboration/connections/following/${userId}`);
    return response.data;
  },
};




