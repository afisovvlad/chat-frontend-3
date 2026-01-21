import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const localApi = createApi({
	reducerPath: 'routeApi',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PROXY_PREFIX }),
	tagTypes: ['EditProfile'],
	endpoints: _ => ({})
});
