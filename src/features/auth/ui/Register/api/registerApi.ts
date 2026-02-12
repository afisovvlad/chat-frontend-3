import { rtkApi } from '@/shared/api/rtkApi';
import { RegisterResponse } from '../model/types/types';

export const registerApi = rtkApi.injectEndpoints({
	overrideExisting: true,
	endpoints: build => ({
		sendNickname: build.mutation<RegisterResponse, string>({
			query: (nickname: string) => ({
				url: `/${process.env.NEXT_PUBLIC_REGISTER}/${nickname}`,
				method: 'GET'
			})
		})
	})
});

export const { useSendNicknameMutation } = registerApi;
