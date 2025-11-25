import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { contentService } from '../services/contentService';
import { BoardResponse, BoardRequest } from '../types';

interface BoardContextType {
    boards: BoardResponse[];
    selectedBoard: BoardResponse | null;
    isLoading: boolean;
    error: string | null;
    fetchUserBoards: (userId: number) => Promise<void>;
    fetchBoardById: (boardId: number) => Promise<void>;
    searchBoards: (keyword: string) => Promise<void>;
    createBoard: (data: BoardRequest) => Promise<BoardResponse>;
    updateBoard: (boardId: number, data: BoardRequest) => Promise<void>;
    deleteBoard: (boardId: number) => Promise<void>;
    clearError: () => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoards = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error('useBoards must be used within a BoardProvider');
    }
    return context;
};

export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [boards, setBoards] = useState<BoardResponse[]>([]);
    const [selectedBoard, setSelectedBoard] = useState<BoardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const fetchUserBoards = useCallback(async (userId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await contentService.getUserBoards(userId);
            console.log("BoardContext", data)
            setBoards(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch user boards');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchBoardById = useCallback(async (boardId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await contentService.getBoard(boardId);
            setSelectedBoard(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch board details');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchBoards = useCallback(async (keyword: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await contentService.searchBoards(keyword);
            setBoards(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to search boards');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createBoard = async (data: BoardRequest): Promise<BoardResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const newBoard = await contentService.createBoard(data);
            setBoards((prev) => [newBoard, ...prev]);
            return newBoard;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create board';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const updateBoard = async (boardId: number, data: BoardRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedBoard = await contentService.updateBoard(boardId, data);
            setBoards((prev) => prev.map((board) => (board.id === boardId ? updatedBoard : board)));
            if (selectedBoard?.id === boardId) {
                setSelectedBoard(updatedBoard);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update board');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBoard = async (boardId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await contentService.deleteBoard(boardId);
            setBoards((prev) => prev.filter((board) => board.id !== boardId));
            if (selectedBoard?.id === boardId) {
                setSelectedBoard(null);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete board');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BoardContext.Provider
            value={{
                boards,
                selectedBoard,
                isLoading,
                error,
                fetchUserBoards,
                fetchBoardById,
                searchBoards,
                createBoard,
                updateBoard,
                deleteBoard,
                clearError,
            }}
        >
            {children}
        </BoardContext.Provider>
    );
};
