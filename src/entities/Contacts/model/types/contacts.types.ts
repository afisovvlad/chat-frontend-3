export interface ContactsSchema {
	uid: string;
	owner_user: string;
	system_contact: {
		uid: string;
		avatar: string | undefined;
		avatar_url: string | undefined;
		avatar_webp: string | undefined;
		avatar_webp_url: string | undefined;
		is_online: boolean;
		was_online_at: number | undefined;
	};
	first_name: string;
	last_name: string;
	phone: string;
	is_in_contacts?: boolean;
	created_at?: number;
}

export interface AddContactByPhoneRequest {
	phone: string;
	first_name: string;
	last_name: string;
}

export interface AddContactResponse {
	uid: string;
	owner_user: string;
	system_contact: ContactsSchema['system_contact'];
	first_name: string;
	last_name: string;
	phone: string;
	is_in_contacts?: boolean;
	created_at?: number;
}

export interface ContactValidationError {
	[field: string]: string[];
}

export interface ContactAuthError {
	detail: string;
}

export type AddContactApiResponse =
	| AddContactResponse
	| ContactValidationError
	| ContactAuthError;

export interface GetContactsRequest {
	pageSize?: number;
	ordering?: string;
	search?: string;
}

export interface PaginatedResponse<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}

export interface CheckContactRequest {
	phone_or_nickname: string;
}
