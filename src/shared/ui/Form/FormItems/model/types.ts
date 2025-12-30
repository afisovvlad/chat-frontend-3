export enum FormItemNames {
	PHONE_NUMBER = 'phone_number',
	CODE = 'code',
	NAME = 'name',
	USERNAME = 'username',
	NICKNAME = 'nickname',
	LAST_NAME = 'last-name',
	EMAIL = 'email',
	SEARCH = 'search',
	MESSAGE = 'message',
	MEDIA = 'media'

	// PHONE = 'phone'
}

export enum FormItemType {
	TEXT = 'text',
	NUMBER = 'number',
	TEXTAREA = 'textarea',
	SELECT = 'select',
	TEL = 'tel',
	CODE = 'code',
	EMAIL = 'email',
	FILE = 'file',
	CHECKBOX = 'checkbox',
	RADIO = 'radio',
	SEARCH = 'search'

	// PASSWORD = 'password'
}
export enum FormItemAutocomplete {
	USERNAME = 'username',
	NICKNAME = 'nickname',
	NAME = 'given-name',
	LAST_NAME = 'family-name',
	CODE = 'one-time-code',
	PHONE = 'tel',
	EMAIL = 'email',
	SEARCH = 'search',
	OFF = 'off',
	ON = 'on'
}

export type SelectOption = {
	value: string;
	label: string;
};
