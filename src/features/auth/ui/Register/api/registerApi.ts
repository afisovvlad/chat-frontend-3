import { rtkApi } from '@/shared/api/rtkApi';
import { RegisterResponse } from '../model/types/types';

export const registerApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		sendNickname: build.query<RegisterResponse, string>({
			query: nickname => ({
				url: `/${process.env.NEXT_PUBLIC_REGISTER}/${nickname}`
			}),

			providesTags: ['Register']
		})
	})
});

export const { useLazySendNicknameQuery } = registerApi;
