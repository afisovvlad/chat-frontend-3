import {
	FormItemAutocomplete,
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';

export const formItems = [
	{
		type: FormItemType.TEXT,
		name: FormItemNames.NAME,
		label: 'Введите имя',
		placeholder: '',
		autocomplete: FormItemAutocomplete.NAME,
		disabled: false,
		// isRequired: false,
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
		label: 'Введите никнейм',
		placeholder: '',
		autocomplete: FormItemAutocomplete.NICKNAME,
		disabled: false,
		// isRequired: false,
		rules: {
			required: 'Заполните это поле',
			minLength: {
				value: 3,
				message: 'Минимум 3 буквы'
			}
		}
	}
];
