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
