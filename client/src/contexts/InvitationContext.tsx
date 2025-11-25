import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { collaborationService } from '../services/collaborationService';
import { InvitationResponse, InvitationRequest } from '../types';

interface InvitationContextType {
    invitations: InvitationResponse[];
    isLoading: boolean;
    error: string | null;
    fetchInvitations: (userId: number) => Promise<void>;
    createInvitation: (data: InvitationRequest) => Promise<InvitationResponse>;
    respondToInvitation: (invitationId: number, response: string) => Promise<void>;
    clearError: () => void;
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export const useInvitations = () => {
    const context = useContext(InvitationContext);
    if (!context) {
        throw new Error('useInvitations must be used within an InvitationProvider');
    }
    return context;
};

export const InvitationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const fetchInvitations = useCallback(async (userId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await collaborationService.getInvitations(userId);
            setInvitations(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch invitations');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createInvitation = async (data: InvitationRequest): Promise<InvitationResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const newInvitation = await collaborationService.createInvitation(data);
            return newInvitation;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to send invitation';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const respondToInvitation = async (invitationId: number, response: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedInvitation = await collaborationService.respondToInvitation(invitationId, response);
            setInvitations((prev) =>
                prev.map((inv) => (inv.id === invitationId ? updatedInvitation : inv))
            );
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to respond to invitation');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <InvitationContext.Provider
            value={{
                invitations,
                isLoading,
                error,
                fetchInvitations,
                createInvitation,
                respondToInvitation,
                clearError,
            }}
        >
            {children}
        </InvitationContext.Provider>
    );
};
