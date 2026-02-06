import { profileActions, ProfileSchema } from '@/entities/Profile';
import { rtkApi } from '@/shared/api/rtkApi';

export const editProfileApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		editProfile: build.mutation<ProfileSchema, Partial<ProfileSchema>>({
			query: data => ({
				url: `/auth/messenger/profile/`,
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['EditProfile'],

			async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
				const currentProfile = (
					getState() as unknown as { profile: ProfileSchema }
				).profile;

				dispatch(
					profileActions.setProfile({
						...currentProfile,
						...arg
					})
				);

				try {
					await queryFulfilled;
				} catch (_) {
					//  rollback при ошибке
					dispatch(profileActions.setProfile(currentProfile));
				}
			}
		})
	}),

	overrideExisting: true
});

export const { useEditProfileMutation } = editProfileApi;
