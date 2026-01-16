import {
	FormItemNames,
	FormItemType
} from '@/shared/ui/FormComponent/FormItems/model/types';

export const formItems = [
	{
		type: FormItemType.EMAIL,
		name: FormItemNames.EMAIL,
		label: 'Укажите Ваш e-mail',
		placeholder: 'e-mail',
		rules: {
			required: 'Заполните это поле',
			pattern: {
				value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				message: 'Некорректный e-mail'
			}
		}
	},
	{
		type: FormItemType.TEXTAREA,
		name: FormItemNames.MESSAGE,
		label: 'Опишите Вашу проблему'
	}
];
