import { localApi } from '@/shared/api/localApi';
import { ProfileSchema } from '@/entities/Profile';

export const editProfileApi = localApi.injectEndpoints({
	endpoints: build => ({
		editProfile: build.mutation<ProfileSchema, Partial<ProfileSchema>>({
			query: data => ({
				url: `/edit-profile`,
				method: 'POST',
				credentials: 'include',
				body: data
			}),
			invalidatesTags: ['EditProfile']
		})
	})
});

export const { useEditProfileMutation } = editProfileApi;
