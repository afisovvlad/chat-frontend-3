import {
	FormItemAutocomplete,
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';

export const formItems = [
	{
		type: FormItemType.TEXT,
		name: FormItemNames.FIRST_NAME,
		label: 'Изменить имя',
		placeholder: 'Иван',
		autocomplete: FormItemAutocomplete.NAME,
		disabled: false,
		isRequired: false,
		rules: {
			required: 'Заполните это поле',
			minLength: {
				value: 3,
				message: 'Минимум 3 буквы'
			},
			pattern: {
				value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
				message: 'Допускаются только буквы'
			}
		}
	},
	{
		type: FormItemType.TEXT,
		name: FormItemNames.LAST_NAME,
		label: 'Изменить фамилию',
		placeholder: 'Иванов',
		autocomplete: FormItemAutocomplete.LAST_NAME,
		disabled: false,
		isRequired: false,
		rules: {
			required: 'Заполните это поле',
			minLength: {
				value: 3,
				message: 'Минимум 3 буквы'
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
		label: 'Изменить никнейм',
		placeholder: 'ivan',
		autocomplete: FormItemAutocomplete.NICKNAME,
		disabled: false,
		isRequired: false,
		rules: {
			required: 'Заполните это поле',
			minLength: {
				value: 3,
				message: 'Минимум 3 буквы'
			},
			pattern: {
				value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
				message: 'Допускаются только буквы'
			}
		}
	}
];
