import api from '../utils/api';

export interface PinRequest {
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  boardId?: number;
  isPublic?: boolean;
  isDraft?: boolean;
}

export interface BoardRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export const contentService = {
  // Pins
  createPin: async (data: PinRequest) => {
    const response = await api.post('/content/pins', data);
    return response.data;
  },

  getPin: async (pinId: number) => {
    const response = await api.get(`/content/pins/${pinId}`);
    return response.data;
  },

  getUserPins: async (userId: number) => {
    const response = await api.get(`/content/pins/user/${userId}`);
    return response.data;
  },

  getPublicPins: async () => {
    const response = await api.get('/content/pins/public');
    return response.data;
  },

  searchPins: async (keyword: string) => {
    const response = await api.get(`/content/pins/search?keyword=${keyword}`);
    return response.data;
  },

  updatePin: async (pinId: number, data: PinRequest) => {
    const response = await api.put(`/content/pins/${pinId}`, data);
    return response.data;
  },

  deletePin: async (pinId: number) => {
    await api.delete(`/content/pins/${pinId}`);
  },

  // Boards
  createBoard: async (data: BoardRequest) => {
    const response = await api.post('/content/boards', data);
    return response.data;
  },

  getBoard: async (boardId: number) => {
    const response = await api.get(`/content/boards/${boardId}`);
    return response.data;
  },

  getUserBoards: async (userId: number) => {
    const response = await api.get(`/content/boards/user/${userId}`);
    return response.data;
  },

  searchBoards: async (keyword: string) => {
    const response = await api.get(`/content/boards/search?keyword=${keyword}`);
    return response.data;
  },

  updateBoard: async (boardId: number, data: BoardRequest) => {
    const response = await api.put(`/content/boards/${boardId}`, data);
    return response.data;
  },

  deleteBoard: async (boardId: number) => {
    await api.delete(`/content/boards/${boardId}`);
  },
};




