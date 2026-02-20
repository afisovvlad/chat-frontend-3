import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileSchema } from '../..';

const initialState: ProfileSchema = {
	username: '',
	nickname: '',
	first_name: '',
	last_name: '',
	patronymic: '',
	additional_information: '',
	birthday: 0,
	email: '',
	gender: '',
	gender_label: '',
	country: '',
	country_label: '',
	city_id: null,
	city: '',
	phone: '',
	avatar: null,
	avatar_url: '',
	avatar_webp: null,
	avatar_webp_url: '',
	is_filled: false,
	is_staff: false,
	error: null,
	isLoading: false
};

const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setProfile(state, action: PayloadAction<ProfileSchema>) {
			return action.payload;
		},

		clearProfile: () => initialState
	}
});

export const { reducer: profileReducer, actions: profileActions } =
	profileSlice;
