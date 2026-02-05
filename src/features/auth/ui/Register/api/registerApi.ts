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

// import { rtkApi } from '@/shared/api/rtkApi';
// import { IRegister } from '../model/types/types';

// export const registerApi = rtkApi.injectEndpoints({
// 	endpoints: build => ({
// 		sendNickname: build.query<string, IRegister>({
// 			query: data => ({
// 				url: `${process.env.NEXT_PUBLIC_BASE_API}/${process.env.NEXT_PUBLIC_REGISTER}/${data.nickname}`,
// 				method: 'GET'
// 			}),
// 			invalidatesTags: ['Register']
// 		})
// 	})
// });

// export const { useSendNicknameQuery } = registerApi;
