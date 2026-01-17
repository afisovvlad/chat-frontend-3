import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const localApi = createApi({
	reducerPath: 'routeApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/api/proxy', credentials: 'include' }),
	tagTypes: ['EditProfile'],
	endpoints: _ => ({})
});
