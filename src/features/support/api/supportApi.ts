import { rtkApi } from '@/shared/api/rtkApi';
import { ISupport } from '../model/types';

export const supportApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		sendSupportMessage: build.mutation<ISupport, ISupport>({
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
