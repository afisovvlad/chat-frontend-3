import { localApi } from '@/shared/api/localApi';

export const editProfileApi = localApi.injectEndpoints({
	endpoints: build => ({
		editProfile: build.mutation({
			query: data => ({
				url: `/api/edit-profile`,
				method: 'POST',
				credentials: 'include',
				body: data
			}),
			invalidatesTags: ['EditProfile']
		})
	})
});

export const { useEditProfileMutation } = editProfileApi;
