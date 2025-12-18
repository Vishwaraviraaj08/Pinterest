import api from '../utils/api';
import { PinRequest, PinResponse, BoardRequest, BoardResponse } from '../types';

export const contentService = {
  
  createPin: async (data: PinRequest): Promise<PinResponse> => {
    const response = await api.post<PinResponse>('/content/pins', data);
    return response.data;
  },

  getPin: async (pinId: number): Promise<PinResponse> => {
    const response = await api.get<PinResponse>(`/content/pins/${pinId}`);
    return response.data;
  },

  getUserPins: async (userId: number): Promise<PinResponse[]> => {
    const response = await api.get<PinResponse[]>(`/content/pins/user/${userId}`);
    return response.data;
  },

  getUserDrafts: async (): Promise<PinResponse[]> => {
    const response = await api.get<PinResponse[]>('/content/pins/drafts');
    return response.data;
  },

  getPublicPins: async (): Promise<PinResponse[]> => {
    const response = await api.get<PinResponse[]>('/content/pins/public');
    return response.data;
  },

  getSponsoredPins: async (): Promise<PinResponse[]> => {
    const response = await api.get<PinResponse[]>('/content/pins/sponsored');
    return response.data;
  },

  searchPins: async (keyword: string): Promise<PinResponse[]> => {
    const response = await api.get<PinResponse[]>(`/content/pins/search?keyword=${keyword}`);
    return response.data;
  },

  updatePin: async (pinId: number, data: PinRequest): Promise<PinResponse> => {
    const response = await api.put<PinResponse>(`/content/pins/${pinId}`, data);
    return response.data;
  },

  deletePin: async (pinId: number): Promise<void> => {
    await api.delete(`/content/pins/${pinId}`);
  },

  
  createBoard: async (data: BoardRequest): Promise<BoardResponse> => {
    const response = await api.post<BoardResponse>('/content/boards', data);
    return response.data;
  },

  getBoard: async (boardId: number): Promise<BoardResponse> => {
    const response = await api.get<BoardResponse>(`/content/boards/${boardId}`);
    return response.data;
  },

  getUserBoards: async (userId: number): Promise<BoardResponse[]> => {
    const response = await api.get<BoardResponse[]>(`/content/boards/user/${userId}`);
    return response.data;
  },

  searchBoards: async (keyword: string): Promise<BoardResponse[]> => {
    const response = await api.get<BoardResponse[]>(`/content/boards/search?keyword=${keyword}`);
    return response.data;
  },

  updateBoard: async (boardId: number, data: BoardRequest): Promise<BoardResponse> => {
    const response = await api.put<BoardResponse>(`/content/boards/${boardId}`, data);
    return response.data;
  },

  deleteBoard: async (boardId: number): Promise<void> => {
    await api.delete(`/content/boards/${boardId}`);
  },

  addPinToBoard: async (boardId: number, pinId: number): Promise<void> => {
    await api.post(`/content/boards/${boardId}/pins/${pinId}`);
  },

  
  createReport: async (data: { title: string; message: string; pinId: number }): Promise<void> => {
    await api.post('/content/reports', data);
  },

  
  getComments: async (pinId: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/content/comments/pin/${pinId}`);
    return response.data;
  },

  createComment: async (data: { text: string; pinId: number }): Promise<any> => {
    const response = await api.post<any>('/content/comments', data);
    return response.data;
  },
};




