import {
	FormItemNames,
	FormItemType
} from '@/shared/ui/FormComponent/FormItems/model/types';

export const formItems = [
	{
		type: FormItemType.TEL,
		name: FormItemNames.PHONE_NUMBER,
		label: 'Введите номер телефона',
		placeholder: '+ 7 900 000 00 00',
		disabled: false
		// isRequired: false
	}
];
