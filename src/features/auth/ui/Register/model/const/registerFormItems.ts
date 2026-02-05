import { FormItemNames, FormItemType } from '@/shared/ui/FormComponent';

export const registerFormItems = [
	{
		type: FormItemType.TEXT,
		name: FormItemNames.NAME,
		label: 'Введите имя',
		rules: {
			required: 'Заполните имя',
			minLength: {
				value: 3,
				message: 'Минимум 3 символа'
			},
			pattern: {
				value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
				message: 'Допускаются только буквы'
			}
		}
	},
	{
		type: FormItemType.TEXT,
		name: FormItemNames.NICKNAME,
		label: 'Введите никнейм',
		rules: {
			required: 'Заполните это поле',
			minLength: {
				value: 3,
				message: 'Минимум 3 символа'
			},
			pattern: {
				value: /^[a-zA-Z0-9._]+$/,
				message: 'Допускаются только латинские буквы и цифры'
			}
		}
	}
];
