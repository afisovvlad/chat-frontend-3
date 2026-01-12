// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { AuthSchema, AuthStep } from './types';

// const initialState: AuthSchema = {
// 	step: 'greeting',
// 	stepHistory: ['greeting'],
// 	isRefreshing: false,
// 	phone_number: '',
// 	code_len: 5,
// 	code: '',
// 	status: 'idle',
// 	error: null,
// 	isDisabledCodeAttempts: false,
// 	is_filled: false
// };

// export const fetchPhone = createAsyncThunk(
// 	'auth/fetchPhone',
// 	async (phone_number: string, { rejectWithValue }) => {
// 		try {
// 			const response = await fetch(
// 				`${process.env.NEXT_PUBLIC_BASE_API}/${process.env.NEXT_PUBLIC_CODE}`,
// 				{
// 					method: 'POST',
// 					headers: {
// 						'Content-Type': 'application/json'
// 					},
// 					body: JSON.stringify({ phone_number: phone_number })
// 				}
// 			);

// 			if (!response.ok) {
// 				throw new Error('Ошибка отправки телефона');
// 			}
// 			return await response.json();
// 		} catch (err: unknown) {
// 			if (err instanceof Error) {
// 				return rejectWithValue(err.message);
// 			} else {
// 				return rejectWithValue('Что-то пошло не так');
// 			}
// 		}
// 	}
// );

// const authSlice = createSlice({
// 	name: 'auth',
// 	initialState,
// 	reducers: {
// 		setStep: (state, action: PayloadAction<AuthStep>) => {
// 			const nextStep = action.payload;

// 			if (state.step !== nextStep) {
// 				state.stepHistory.push(nextStep);
// 				state.step = nextStep;
// 			}
// 		},

// 		goBack: state => {
// 			if (state.stepHistory.length > 1) {
// 				state.stepHistory.pop();
// 				state.step = state.stepHistory[state.stepHistory.length - 1];
// 			}
// 		},
// 		// Флаг для предотвращения race condition при refresh
// 		setRefreshing: (state, action: PayloadAction<boolean>) => {
// 			state.isRefreshing = action.payload;
// 			state.isRefreshing = action.payload;
// 		},
// 		logout: state => {
// 			state.isRefreshing = false;
// 		},
// 		disabledCodeAttempts: (state, action: PayloadAction<boolean>) => {
// 			state.isDisabledCodeAttempts = action.payload;
// 		}
// 	},

// 	extraReducers: builder => {
// 		builder
// 			.addCase(fetchPhone.pending, state => {
// 				state.status = 'loading';
// 				state.error = null;
// 			})
// 			.addCase(fetchPhone.fulfilled, (state, action) => {
// 				state.status = 'succeeded';
// 				state.error = null;
// 				state.phone_number = action.payload.phone_number;
// 				state.code_len = action.payload.code_len;
// 			})
// 			.addCase(fetchPhone.rejected, (state, action) => {
// 				state.status = 'failed';
// 				state.error = action.error.message || 'Что-то пошло не так';
// 			});
// 	}
// });

// export const { reducer: authReducer, actions: authActions } = authSlice;
