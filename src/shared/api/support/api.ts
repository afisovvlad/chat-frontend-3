import { rtkApi } from '../rtkApi';
import { SupportRequest, SupportResponse } from './types';

export const supportApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		sendSupportMessage: build.mutation<SupportResponse, SupportRequest>({
			query: data => ({
				url: `${process.env.NEXT_PUBLIC_BASE_API}/${process.env.NEXT_PUBLIC_SUPPORT}`,
				method: 'POST',
				body: data
			}),
			//Тэг для инвалидации кэша
			invalidatesTags: ['Support']
		})
	})
});

export const { useSendSupportMessageMutation } = supportApi;
