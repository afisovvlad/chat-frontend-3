export interface ProfileSchema {
	avatar?: string;
	avatar_url?: string;
	avatar_webp?: string;
	avatar_webp_url?: string;
	nickname?: string;
	first_name: string;
	last_name: string;
	patronymic?: string;
	additional_information?: string;
	birthday?: number;
	email?: string;
	gender?: 'male' | 'female';
	country?: string;
	city_id?: number;
	phone?: string;
	file_url?: string;
}

export interface CustomStylesOptions {
	hasError?: boolean;
}
