import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { collaborationService } from '../services/collaborationService';
import { ConnectionResponse } from '../types';

interface ConnectionContextType {
    followers: ConnectionResponse[];
    following: ConnectionResponse[];
    isLoading: boolean;
    error: string | null;
    fetchFollowers: (userId: number) => Promise<void>;
    fetchFollowing: (userId: number) => Promise<void>;
    followUser: (userId: number) => Promise<void>;
    unfollowUser: (userId: number) => Promise<void>;
    clearError: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnections = () => {
    const context = useContext(ConnectionContext);
    if (!context) {
        throw new Error('useConnections must be used within a ConnectionProvider');
    }
    return context;
};

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [followers, setFollowers] = useState<ConnectionResponse[]>([]);
    const [following, setFollowing] = useState<ConnectionResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const fetchFollowers = useCallback(async (userId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await collaborationService.getFollowers(userId);
            setFollowers(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch followers');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchFollowing = useCallback(async (userId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await collaborationService.getFollowing(userId);
            setFollowing(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch following');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const followUser = async (userId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await collaborationService.followUser(userId);
            // Optimistically update or refetch
            // For now, we'll just refetch following list if we have the current user's ID available
            // But since we don't have current user ID here easily without circular dependency, 
            // we rely on the component to trigger refetch if needed
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to follow user');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const unfollowUser = async (userId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await collaborationService.unfollowUser(userId);
            setFollowing((prev) => prev.filter((conn) => conn.followingId !== userId));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to unfollow user');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ConnectionContext.Provider
            value={{
                followers,
                following,
                isLoading,
                error,
                fetchFollowers,
                fetchFollowing,
                followUser,
                unfollowUser,
                clearError,
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
};
