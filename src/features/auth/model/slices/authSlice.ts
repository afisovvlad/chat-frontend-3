import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema } from '../types/AuthSchema';

const initialState: AuthSchema = {
	isRefreshing: false,
	phone_number: '',
	code_len: 0,
	code: '',
	status: 'idle',
	error: null,
	isDisabledCodeAttempts: false
};

export const fetchPhone = createAsyncThunk(
	'auth/fetchPhone',
	async (phone_number: string, { rejectWithValue }) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_API}/${process.env.NEXT_PUBLIC_CODE}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ phone_number: phone_number })
				}
			);

			if (!response.ok) {
				throw new Error('Ошибка отправки телефона');
			}
			// const result = await response.json();
			// console.log("result in 'fetchPhone'", result);
			// return result;
			return await response.json();
		} catch (err: unknown) {
			if (err instanceof Error) {
				return rejectWithValue(err.message);
			} else {
				return rejectWithValue('Что-то пошло не так');
			}
		}
	}
);

// export const fetchCode = createAsyncThunk(
// 	'auth/fetchCode',
// 	async (
// 		{ phone_number, code }: { phone_number: string; code: string },
// 		{ rejectWithValue }
// 	) => {
// 		try {
// 			const response = await fetch(
// 				`${process.env.NEXT_PUBLIC_BASE_API}/${process.env.NEXT_PUBLIC_TOKEN}`,
// 				{
// 					method: 'POST',
// 					headers: {
// 						'Content-Type': 'application/json'
// 					},
// 					body: JSON.stringify({ phone_number: phone_number, code: code })
// 				}
// 			);

// 			if (!response.ok) {
// 				throw new Error('Ошибка отправки кода');
// 			}
// 			const result = await response.json();
// 			console.log("result in 'fetchPhone'", result);
// 			return result;
// 			// return await response.json();
// 		} catch (err: unknown) {
// 			if (err instanceof Error) {
// 				return rejectWithValue(err.message);
// 			} else {
// 				return rejectWithValue('Что-то пошло не так');
// 			}
// 		}
// 	}
// );

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
		},
		disabledCodeAttempts: (state, action: PayloadAction<boolean>) => {
			state.isDisabledCodeAttempts = action.payload;
		}
	},

	extraReducers: builder => {
		builder
			.addCase(fetchPhone.pending, state => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchPhone.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.error = null;
				state.phone_number = action.payload.phone_number;
				state.code_len = action.payload.code_len;
			})
			.addCase(fetchPhone.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Что-то пошло не так';
			});
	}
});

export const { reducer: authReducer, actions: authActions } = authSlice;
