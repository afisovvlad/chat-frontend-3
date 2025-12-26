import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQuery';

export const rtkApi = createApi({
	reducerPath: 'rtkApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Support'], //Тэги для инвалидации кэша
	endpoints: builder => ({})
});
