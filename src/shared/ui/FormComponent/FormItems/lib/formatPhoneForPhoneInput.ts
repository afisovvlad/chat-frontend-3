export const formatPhoneForPhoneInput = (
	value: string | undefined | null
): string => {
	// Безопасная проверка
	if (!value && value !== '') {
		return '';
	}

	// Приводим к строке
	const strValue = String(value || '');

	// Убираем все нецифры
	const digits = strValue.replace(/\D/g, '');

	// Если нет цифр, возвращаем пустую строку
	if (!digits || digits === '') {
		return '';
	}

	// Убираем код страны если он есть - безопасно
	const cleanDigits = digits.startsWith('7')
		? digits.length > 1
			? digits.slice(1)
			: ''
		: digits;

	// Если после удаления кода страны ничего не осталось
	if (!cleanDigits) {
		return '+7';
	}

	// Форматируем с проверками
	let formatted = '+7';

	if (cleanDigits.length > 0) {
		formatted += ` ${cleanDigits.slice(0, Math.min(3, cleanDigits.length))}`;
	}
	if (cleanDigits.length > 3) {
		formatted += ` ${cleanDigits.slice(3, Math.min(6, cleanDigits.length))}`;
	}
	if (cleanDigits.length > 6) {
		formatted += ` ${cleanDigits.slice(6, Math.min(8, cleanDigits.length))}`;
	}
	if (cleanDigits.length > 8) {
		formatted += ` ${cleanDigits.slice(8, Math.min(10, cleanDigits.length))}`;
	}

	return formatted;
};
