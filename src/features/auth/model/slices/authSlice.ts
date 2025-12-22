import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSchema } from '../types/AuthSchema';

const initialState: AuthSchema = {
	isRefreshing: false,
	phone: '',
	status: 'idle',
	error: null
};

export const fetchPhone = createAsyncThunk(
	'auth/fetchPhone',
	async (phone: string, { rejectWithValue }) => {
		try {
			// const token = localStorage.getItem("token");

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_API}/${process.env.NEXT_PUBLIC_PHONE}/${phone}`,
				{
					method: 'POST',
					headers: {
						// Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);

			if (!response.ok) {
				throw new Error('Ошибка отправки телефона');
			}

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
		setPhone: (state, action: PayloadAction<string>) => {
			state.phone = action.payload;
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
				state.phone = action.payload;
			})
			.addCase(fetchPhone.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Что-то пошло не так';
			});
		// .addCase(updateProductsInCart.pending, state => {
		// 	state.status = 'loading';
		// 	state.error = null;
		// })
		// .addCase(updateProductsInCart.fulfilled, (state, action) => {
		// 	state.status = 'succeeded';
		// 	state.error = null;
		// 	state.cart = action.payload;
		// })
		// .addCase(updateProductsInCart.rejected, (state, action) => {
		// 	state.status = 'failed';
		// 	state.error = action.error.message || 'Something went wrong';
		// });
	}
});

export const { reducer: authReducer, actions: authActions } = authSlice;
// export const { setRefreshing, logout, setPhone } = authSlice.actions;
// export const authReducer = authSlice.reducer;
