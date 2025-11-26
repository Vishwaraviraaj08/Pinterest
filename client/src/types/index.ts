export interface UserResponse {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio?: string;
    avatar?: string;
    mobileNumber?: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    username: string;
    userId: number;
    message: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    mobileNumber?: string;
}

export interface PasswordResetRequest {
    email: string;
    newPassword: string;
}

export interface PinRequest {
    title: string;
    description?: string;
    imageUrl: string;
    link?: string;
    boardId?: number;
    isPublic?: boolean;
    isDraft?: boolean;
    keywords?: string[];
}

export interface PinResponse {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    userId: number;
    boardId: number;
    isPublic: boolean;
    isDraft: boolean;
    isSponsored: boolean;
    savesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
    keywords?: string[];
}

export interface BoardResponse {
    id: number;
    name: string;
    description?: string;
    userId: number;
    isPrivate: boolean;
    coverImage?: string;
    pinCount: number;
    pins?: PinResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface BoardRequest {
    name: string;
    description?: string;
    isPrivate?: boolean;
    coverImage?: string;
}

export interface ConnectionResponse {
    id: number;
    followerId: number;
    followingId: number;
    createdAt: string;
}

export interface InvitationResponse {
    id: number;
    boardId?: number;
    inviterId: number;
    inviteeId: number;
    invitationType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface InvitationRequest {
    inviteeId: number;
    boardId?: number;
    invitationType: string;
}

export interface BusinessProfileResponse {
    id: number;
    userId: number;
    businessName: string;
    description?: string;
    website?: string;
    logo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BusinessProfileRequest {
    businessName: string;
    description?: string;
    website?: string;
    logo?: string;
}

export interface ApiError {
    message: string;
    status: number;
    timestamp: string;
}

export interface OtpRequest {
    email: string;
}

export interface OtpVerificationRequest {
    email: string;
    otp: string;
}

// Aliases for backward compatibility
export type Pin = PinResponse;
export type User = UserResponse;
export type Board = BoardResponse;
export type Connection = ConnectionResponse;
export type Invitation = InvitationResponse;
export type BusinessProfile = BusinessProfileResponse;
