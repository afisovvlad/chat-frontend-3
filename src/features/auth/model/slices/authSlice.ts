import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema } from '../types/AuthSchema';

const initialState: AuthSchema = {
	isRefreshing: false
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Флаг для предотвращения race condition при refresh
		setRefreshing: (state, action: PayloadAction<boolean>) => {
			state.isRefreshing = action.payload;
			state.isRefreshing = action.payload;
		},
		logout: state => {
			state.isRefreshing = false;
		}
	}
});

export const { reducer: authReducer, actions: authActions } = authSlice;
