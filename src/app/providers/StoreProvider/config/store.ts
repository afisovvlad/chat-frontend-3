import { authReducer } from '@/features/auth';
import { citiesReducer } from '@/pages/Cities';
import { rtkApi } from '@/shared/api/rtkApi';
import {
	combineReducers,
	configureStore,
	ReducersMapObject
} from '@reduxjs/toolkit';
import { StateSchema } from './StateSchema';
import { localApi } from '@/shared/api/localApi';

const rootReducer = combineReducers<ReducersMapObject<StateSchema>>({
	[localApi.reducerPath]: localApi.reducer,
	[rtkApi.reducerPath]: rtkApi.reducer,
	cities: citiesReducer,
	auth: authReducer
});

export const makeStore = (initialState?: StateSchema) => {
	return configureStore({
		reducer: rootReducer,
		preloadedState: initialState,
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware().concat([localApi.middleware, rtkApi.middleware])
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
