import { ProfileSchema } from '@/entities/Profile';
import { rtkApi } from '@/shared/api/rtkApi';

export const editProfileApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		editProfile: build.mutation<ProfileSchema, Partial<ProfileSchema>>({
			query: data => ({
				url: `/auth/messenger/profile/`,
				method: 'POST',
				credentials: 'include',
				body: data
			})
			// invalidatesTags: ['EditProfile']
		})
	})
});

export const { useEditProfileMutation } = editProfileApi;
