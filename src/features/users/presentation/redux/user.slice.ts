import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../domain/user';

type UsersState = {
    lastUpdatedId: string | null;
    entities: Record<string, User>;
};

const initialState: UsersState = {
    lastUpdatedId: null,
    entities: {},
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        storeUser: (state, action: PayloadAction<User>) => {
            const user = action.payload;
            state.lastUpdatedId = user.id;
            state.entities[user.id] = user;
        },
        removeUser: (state, action: PayloadAction<{ id: string }>) => {
            delete state.entities[action.payload.id];
        }
    },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
