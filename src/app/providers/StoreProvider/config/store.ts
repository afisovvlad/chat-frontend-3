import { citiesReducer } from '@/pages/Cities';
import { rtkApi } from '@/shared/api/rtkApi';
import {
	combineReducers,
	configureStore,
	ReducersMapObject
} from '@reduxjs/toolkit';
import { StateSchema } from './StateSchema';

const rootReducer = combineReducers<ReducersMapObject<StateSchema>>({
	[rtkApi.reducerPath]: rtkApi.reducer,
	cities: citiesReducer
});

export const makeStore = (initialState?: StateSchema) => {
	return configureStore({
		reducer: rootReducer,
		preloadedState: initialState,
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware().concat(rtkApi.middleware),
		devTools: process.env.NODE_ENV !== 'production'
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
