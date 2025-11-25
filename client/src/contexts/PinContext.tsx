import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { contentService } from '../services/contentService';
import { PinResponse, PinRequest } from '../types';

interface PinContextType {
    pins: PinResponse[];
    selectedPin: PinResponse | null;
    isLoading: boolean;
    error: string | null;
    fetchPublicPins: () => Promise<void>;
    fetchUserPins: (userId: number) => Promise<void>;
    fetchPinById: (pinId: number) => Promise<void>;
    searchPins: (keyword: string) => Promise<void>;
    createPin: (data: PinRequest) => Promise<PinResponse>;
    updatePin: (pinId: number, data: PinRequest) => Promise<void>;
    deletePin: (pinId: number) => Promise<void>;
    clearError: () => void;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export const usePins = () => {
    const context = useContext(PinContext);
    if (!context) {
        throw new Error('usePins must be used within a PinProvider');
    }
    return context;
};

export const PinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pins, setPins] = useState<PinResponse[]>([]);
    const [selectedPin, setSelectedPin] = useState<PinResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const fetchPublicPins = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await contentService.getPublicPins();
            setPins(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch public pins');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUserPins = useCallback(async (userId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await contentService.getUserPins(userId);
            setPins(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch user pins');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchPinById = useCallback(async (pinId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await contentService.getPin(pinId);
            setSelectedPin(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch pin details');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchPins = useCallback(async (keyword: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await contentService.searchPins(keyword);
            setPins(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to search pins');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createPin = async (data: PinRequest): Promise<PinResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const newPin = await contentService.createPin(data);
            setPins((prev) => [newPin, ...prev]);
            return newPin;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create pin';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const updatePin = async (pinId: number, data: PinRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedPin = await contentService.updatePin(pinId, data);
            setPins((prev) => prev.map((pin) => (pin.id === pinId ? updatedPin : pin)));
            if (selectedPin?.id === pinId) {
                setSelectedPin(updatedPin);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update pin');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deletePin = async (pinId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await contentService.deletePin(pinId);
            setPins((prev) => prev.filter((pin) => pin.id !== pinId));
            if (selectedPin?.id === pinId) {
                setSelectedPin(null);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete pin');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PinContext.Provider
            value={{
                pins,
                selectedPin,
                isLoading,
                error,
                fetchPublicPins,
                fetchUserPins,
                fetchPinById,
                searchPins,
                createPin,
                updatePin,
                deletePin,
                clearError,
            }}
        >
            {children}
        </PinContext.Provider>
    );
};
