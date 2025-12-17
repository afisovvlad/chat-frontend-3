import { rtkApi } from '@/shared/api/rtkApi';

const citiesApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		getCities: build.query({
			query: () => ({
				// здесь почему-то если в конце убрать "/" то запрос не работает
				url: '/auth/profile/cities/'
			})
		}),
		getCode: build.mutation({
			query: () => ({
				url: '/auth/messenger/login/get/code',
				body: {
					phone_number: '+79876543210'
				}
			})
		}),
		getTokens: build.mutation({
			query: () => ({
				url: '/auth/messenger/login/get/token',
				body: {
					phone_number: '+79876543210',
					code: '11111'
				}
			})
		})
	})
});

export const { useGetCitiesQuery, useGetCodeMutation, useGetTokensMutation } =
	citiesApi;
