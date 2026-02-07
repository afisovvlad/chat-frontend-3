import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	PersistConfig
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { authReducer } from '@/features/auth/model/slices/authSlice';
import { profileReducer } from '@/entities/Profile';
import { citiesReducer } from '@/pages/Cities';
import { rtkApi } from '@/shared/api/rtkApi';
import { localApi } from '@/shared/api/localApi';

/* ======================
   Types
   ====================== */

export type AppStore = ReturnType<typeof makeStore>['store'];
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;

/* ======================
   Storage (Next.js safe)
   ====================== */

const storage =
	typeof window !== 'undefined'
		? createWebStorage('local')
		: {
				getItem: () => Promise.resolve(null),
				setItem: () => Promise.resolve(),
				removeItem: () => Promise.resolve()
			};

/* ======================
   Persist config
   ====================== */

const persistConfig: PersistConfig<RootState> = {
	key: 'root',
	storage,
	whitelist: ['auth', 'profile'],
	blacklist: [rtkApi.reducerPath, localApi.reducerPath],
	stateReconciler: autoMergeLevel2
};

/* ======================
   Root reducer
   ====================== */

const rootReducer = combineReducers({
	[rtkApi.reducerPath]: rtkApi.reducer,
	[localApi.reducerPath]: localApi.reducer,
	auth: authReducer,
	profile: profileReducer,
	cities: citiesReducer
});

/* ======================
   Persisted reducer
   ====================== */

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ======================
   Store factory
   ====================== */

export const makeStore = () => {
	const store = configureStore({
		reducer: persistedReducer,
		devTools: process.env.NODE_ENV !== 'production',
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
				}
			}).concat(rtkApi.middleware, localApi.middleware)
	});

	const persistor = persistStore(store);

	return { store, persistor };
};

// Logout должен выглядеть так!!!:

// dispatch(PURGE());
// dispatch(rtkApi.util.resetApiState());
// dispatch(localApi.util.resetApiState());
// Иначе:
// кэш запросов может «залипать»
// старые данные всплывают после логина

// *********************

// import { profileReducer } from '@/entities/Profile';
// import { authReducer } from '@/features/auth/model/slices/authSlice';
// import { citiesReducer } from '@/pages/Cities';
// import { localApi } from '@/shared/api/localApi';
// import { rtkApi } from '@/shared/api/rtkApi';
// import {
// 	combineReducers,
// 	configureStore,
// 	ReducersMapObject
// } from '@reduxjs/toolkit';
// import { StateSchema } from './StateSchema';

// const rootReducer = combineReducers<ReducersMapObject<StateSchema>>({
// 	[localApi.reducerPath]: localApi.reducer,
// 	[rtkApi.reducerPath]: rtkApi.reducer,
// 	cities: citiesReducer,
// 	auth: authReducer,
// 	profile: profileReducer
// });

// export const makeStore = (initialState?: StateSchema) => {
// 	return configureStore({
// 		reducer: rootReducer,
// 		preloadedState: initialState,
// 		devTools: true,
// 		middleware: getDefaultMiddleware =>
// 			getDefaultMiddleware().concat([localApi.middleware, rtkApi.middleware])
// 	});
// };

// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore['getState']>;
// export type AppDispatch = AppStore['dispatch'];
