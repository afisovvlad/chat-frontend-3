export interface ProfileSchema {
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
}

export interface CustomStylesOptions {
	hasError?: boolean;
}
