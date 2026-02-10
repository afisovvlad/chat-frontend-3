import { profileActions, ProfileSchema } from '@/entities/Profile';
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
			providesTags: ['EditProfile']
		}),

		//  Редактирование
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
	// Отправка запроса за свежими данными
	overrideExisting: false
});

export const { useGetProfileQuery, useEditProfileMutation } = profileApi;
