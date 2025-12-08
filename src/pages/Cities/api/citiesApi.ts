import { rtkApi } from '@/shared/api/rtkApi';

const citiesApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		getCities: build.query({
			query: () => ({
				// здесь почему-то если в конце убрать "/" то запрос не работает
				url: '/auth/profile/cities/'
			})
		})
	})
});

export const { useGetCitiesQuery } = citiesApi;
