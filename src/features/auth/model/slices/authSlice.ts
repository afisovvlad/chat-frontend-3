import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema } from '../types/AuthSchema';
import { AuthStep } from '../types/authStep';

const initialState: AuthSchema = {
	step: 'greeting',
	stepHistory: ['greeting'],
	isRefreshing: false,
	phone_number: '',
	code_len: 5,
	code: '',
	status: 'idle',
	error: null,
	isDisabledCodeAttempts: false,
	is_filled: false
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
		logout: () => {
			return { ...initialState };
		},
		disabledCodeAttempts: (state, action: PayloadAction<boolean>) => {
			state.isDisabledCodeAttempts = action.payload;
		},
		setPhoneData: (
			state,
			action: PayloadAction<{ phone_number: string; code_len: number }>
		) => {
			state.phone_number = action.payload.phone_number;
			state.code_len = action.payload.code_len;
		},

		clearPhoneData: state => {
			delete state.phone_number;
			delete state.code_len;
		},

		setStep: (state, action: PayloadAction<AuthStep>) => {
			const nextStep = action.payload;

			if (state.step !== nextStep) {
				state.stepHistory.push(nextStep);
				state.step = nextStep;
			}
		},

		goBack: state => {
			if (state.stepHistory.length > 1) {
				state.stepHistory.pop();
				state.step = state.stepHistory[state.stepHistory.length - 1];
			}
		}
	}
});

export const { reducer: authReducer, actions: authActions } = authSlice;
