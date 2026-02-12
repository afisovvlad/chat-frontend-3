import { profileActions, ProfileSchema } from '@/entities/Profile';
import { rtkApi } from '@/shared/api/rtkApi';

export const profileApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		//удалить после изменения в Avatar, SettingsPage и UserCard
		// getProfile: build.query<ProfileSchema, void>({
		// 	query: () => ({
		// 		url: `/auth/messenger/profile/`,
		// 		method: 'POST',
		// 		body: {}
		// 	}),
		// 	providesTags: ['EditProfile']
		// }),

		//  Редактирование
		editProfile: build.mutation<ProfileSchema, Partial<ProfileSchema>>({
			query: data => ({
				url: `/auth/messenger/profile/`,
				method: 'POST',
				body: data
			}),

			invalidatesTags: ['EditProfile'],

			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;

					dispatch(profileActions.setProfile(data));
				} catch (error) {
					console.log(error);
				}
			}
		})
	}),
	// Отправка запроса за свежими данными
	overrideExisting: true
});

export const { useEditProfileMutation } = profileApi;

// ***************
// import { profileActions, ProfileSchema } from '@/entities/Profile';
// import { rtkApi } from '@/shared/api/rtkApi';

// export const profileApi = rtkApi.injectEndpoints({
// 	endpoints: build => ({
// 		//удалить после изменения в Avatar, SettingsPage и UserCard
// 		getProfile: build.query<ProfileSchema, void>({
// 			query: () => ({
// 				url: `/auth/messenger/profile/`,
// 				method: 'POST',
// 				body: {}
// 			}),
// 			providesTags: ['EditProfile']
// 		}),

// 		//  Редактирование
// 		editProfile: build.mutation<ProfileSchema, Partial<ProfileSchema>>({
// 			query: data => ({
// 				url: `/auth/messenger/profile/`,
// 				method: 'POST',
// 				body: data
// 			}),

// 			invalidatesTags: ['EditProfile'],

// 			async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
// 				const currentProfile = (
// 					getState() as unknown as { profile: ProfileSchema }
// 				).profile;

// 				dispatch(
// 					profileActions.setProfile({
// 						...currentProfile,
// 						...arg
// 					})
// 				);

// 				try {
// 					await queryFulfilled;
// 				} catch (_) {
// 					//  rollback при ошибке
// 					dispatch(profileActions.setProfile(currentProfile));
// 				}
// 			}
// 		})
// 	}),
// 	// Отправка запроса за свежими данными
// 	overrideExisting: true
// });

// export const { useGetProfileQuery, useEditProfileMutation } = profileApi;
