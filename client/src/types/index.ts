export interface Pin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  userId: string;
  username: string;
  userAvatar: string;
  boardId?: string;
  boardName?: string;
  saves: number;
  comments: number;
  createdAt: string;
  isSponsored?: boolean;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  userId: string;
  pins: Pin[];
  pinCount: number;
  isPrivate: boolean;
  collaborators?: string[];
  coverImages: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  pinId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}