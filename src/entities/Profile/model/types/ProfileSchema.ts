export interface ProfileSchema {
	username: string;
	nickname?: string;
	first_name: string;
	last_name: string;
	patronymic?: string;
	additional_information?: string;
	birthday?: number;
	email?: string;
	gender?: 'male' | 'female' | '';
	gender_label: string;
	country?: string;
	country_label: string;
	city_id?: number | null;
	city: string;
	phone?: string;
	avatar: string | null;
	avatar_url: string | null;
	avatar_webp: string | null;
	avatar_webp_url: string | null;
	is_filled: boolean;
	is_staff: boolean;
	error: null | string;
	isLoading: boolean;
}

export interface CustomStylesOptions {
	hasError?: boolean;
}
