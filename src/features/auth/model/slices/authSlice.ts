import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema, PhoneSessionData } from '../types/AuthSchema';
import { AuthStep } from '../types/authStep';

const initialState: AuthSchema = {
	step: 'greeting',
	stepHistory: ['greeting'],
	isRefreshing: false,
	phone_number: '',
	status: 'idle',
	error: null,
	isDisabledCodeAttempts: false,
	blockingTime: 0,
	attemptCounter: 0,
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

		logout: () => initialState,

		disabledCodeAttempts: (state, action: PayloadAction<boolean>) => {
			state.isDisabledCodeAttempts = action.payload;
		},

		setBlockingTime: (state, action: PayloadAction<number | undefined>) => {
			state.blockingTime = action.payload;
		},

		setAttemptCounter: (state, action: PayloadAction<number>) => {
			state.attemptCounter = action.payload;
		},

		incrementAttemptCounter: state => {
			state.attemptCounter += 1;
		},

		resetAttemptCounter: state => {
			state.attemptCounter = 0;
		},

		setPhoneData: (state, action: PayloadAction<{ phone_number: string }>) => {
			state.phone_number = action.payload.phone_number;
		},

		setPhoneSession: (state, action: PayloadAction<PhoneSessionData>) => {
			state.phoneSession = action.payload;
		},

		clearPhoneData: state => {
			delete state.phone_number;
			delete state.phoneSession;
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
