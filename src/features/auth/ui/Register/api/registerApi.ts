import { rtkApi } from '@/shared/api/rtkApi';
import { RegisterResponse } from '../model/types/types';

export const registerApi = rtkApi.injectEndpoints({
	overrideExisting: true, // важно в Next.js
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

// *******
// import { rtkApi } from '@/shared/api/rtkApi';
// import { RegisterResponse } from '../model/types/types';

// export const registerApi = rtkApi.injectEndpoints({
// 	overrideExisting: true,
// 	endpoints: build => ({
// 		sendNickname: build.query<RegisterResponse, string>({
// 			query: nickname => ({
// 				url: `/${process.env.NEXT_PUBLIC_REGISTER}/${nickname}`
// 			}),
// 			forceRefetch: () => true,
// 			providesTags: ['Register']
// 		})
// 	})
// });

// export const { useLazySendNicknameQuery } = registerApi;
