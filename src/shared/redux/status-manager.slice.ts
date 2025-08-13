
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface OperationMeta {
    status: RequestStatus;
    lastUpdated?: number; // UNIX timestamp
    retries: number;
    error?: unknown;
    cacheUntil?: number; // For caching: timestamp until valid
}

interface StatusPayload {
    key: string;
    status: RequestStatus;
    error?: unknown;
    cacheDurationMs?: number; // Optional for caching
}

type StatusMap = Record<string, OperationMeta>;

const initialState: StatusMap = {};

const statusManagerSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<StatusPayload>) => {
            const now = Date.now();
            const { key, status, error, cacheDurationMs } = action.payload;
            const current = state[key] || { retries: 0 };

            state[key] = {
                ...current,
                status,
                error,
                lastUpdated: now,
                ...(
                    cacheDurationMs
                        ? { cacheUntil: now + cacheDurationMs }
                        : {}
                ),
                retries: status === 'error' ? current.retries + 1 : 0,
            };
        },
        resetStatus: (state, action: PayloadAction<{ key: string }>) => {
            delete state[action.payload.key];
        },
    },
});

export const { setStatus, resetStatus } = statusManagerSlice.actions;
export const statusManagerReducer = statusManagerSlice.reducer;
