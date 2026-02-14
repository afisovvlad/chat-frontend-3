import { ProfileSchema } from '@/entities/Profile';
import { rtkApi } from '@/shared/api/rtkApi';

export const profileApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		//GET-запрос (на самом деле POST {})
		getProfile: build.query<ProfileSchema, void>({
			query: () => ({
				url: `/auth/messenger/profile/`,
				method: 'POST',
				body: {}
			}),
			providesTags: ['Profile']
		}),

		//  Редактирование
		editProfile: build.mutation<ProfileSchema, Partial<ProfileSchema>>({
			query: data => ({
				url: `/auth/messenger/profile/`,
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['Profile']
		})
	}),
	overrideExisting: false
});

export const { useGetProfileQuery, useEditProfileMutation } = profileApi;
