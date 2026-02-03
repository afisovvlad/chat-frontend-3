import { FormItemNames, FormItemType } from '@/shared/ui/FormComponent';

export const registerFormItems = [
	{
		type: FormItemType.TEXT,
		name: FormItemNames.NAME,
		label: 'Введите имя'
	},
	{
		type: FormItemType.TEXT,
		name: FormItemNames.NICKNAME,
		label: 'Введите никнейм'
	}
];
