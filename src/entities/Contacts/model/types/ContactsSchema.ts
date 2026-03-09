export interface ContactsSchema {
	uid: string;
	owner_user: string;
	system_contact: {
		uid: string;
		avatar: string;
		avatar_url: string;
		avatar_webp: string;
		avatar_webp_url: string;
		is_online: boolean;
		was_online_at: number;
	};
	first_name: string;
	last_name: string;
	phone: string;
}

//  Запрос на добавление контакта
export interface AddContactByPhoneRequest {
	phone: string;
	first_name: string;
	last_name: string;
}

// Ответ при успехе (201 Created)
export interface AddContactResponse {
	uid: string;
	owner_user: string;
	system_contact: {
		uid: string;
		is_deleted: boolean;
		avatar: string | null;
		avatar_url: string | null;
		avatar_webp: string | null;
		avatar_webp_url: string | null;
		is_online: boolean;
		was_online_at: number | null;
	};
	first_name: string;
	last_name: string;
	phone: string;
	//  Дополнительные поля, если вернёт бэкенд
	is_in_contacts?: boolean;
	created_at?: number;
}

// Ответ при ошибке валидации (400 Bad Request)
export interface ContactValidationError {
	[field: string]: string[];
}

//  Ответ при ошибке авторизации (401 Unauthorized)
export interface ContactAuthError {
	detail: string;
}

//  Union тип для всех возможных ответов
export type AddContactApiResponse =
	| AddContactResponse
	| ContactValidationError
	| ContactAuthError;
