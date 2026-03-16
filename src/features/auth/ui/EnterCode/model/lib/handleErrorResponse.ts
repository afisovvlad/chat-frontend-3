import { AppDispatch } from '@/app/providers/StoreProvider';
import { authActions } from '@/features/auth';
import { UseFormSetError } from 'react-hook-form';
import { LoginCodeForm } from '../..';

export const handleErrorResponse = async (
	currentAttempts: number,
	attemptCounter: number,
	setAttemptsNumber: React.Dispatch<React.SetStateAction<number>>,
	// setAttemptCounter: React.Dispatch<React.SetStateAction<number>>,
	setTime: React.Dispatch<React.SetStateAction<number>>,
	dispatch: AppDispatch,
	setError: UseFormSetError<LoginCodeForm>
): Promise<void> => {
	const MINUTES_BLOCK = 60; // 2 минуты
	const SECONDS_BLOCK = 30;
	const MAX_BLOCK_DURATION = 3600; // 1 час

	let blockTime: number = 0; // Поставить время из store
	let errorMessage: string;
	let shouldBlock = false;
	// const attemptCounter = 0;

	console.log('currentAttempts in handleErrorResponse', currentAttempts);
	console.log('attemptCounter in handleErrorResponse', attemptCounter);

	if (currentAttempts === 1) {
		if (attemptCounter === 0) {
			blockTime = MINUTES_BLOCK;
			shouldBlock = true;
			errorMessage = 'Слишком много неверных попыток.';
		}

		if (attemptCounter >= 1) {
			blockTime = MAX_BLOCK_DURATION;
			shouldBlock = true;
			errorMessage = 'Лимит исчерпан.';
		}

		// setAttemptCounter(prev => prev + 1);
		dispatch(authActions.incrementAttemptCounter());
		setAttemptsNumber(5);
	} else {
		// Обычная ошибка
		blockTime = SECONDS_BLOCK;
		errorMessage = `Код введен неверно. Осталось попыток: ${currentAttempts - 1}`;
		setAttemptsNumber(prev => prev - 1); // Используем функциональное обновление
	}

	// Блокируем аккаунт если нужно
	if (shouldBlock) {
		setTime(blockTime);
		dispatch(authActions.disabledCodeAttempts(true));
		dispatch(authActions.setBlockingTime(blockTime));
		// dispatch(authActions.setAttemptCounter(attemptCounter));

		// Разблокировка через время
		setTimeout(() => {
			dispatch(authActions.disabledCodeAttempts(false));
			dispatch(authActions.setBlockingTime(0));
			// setAttemptsNumber(5); // или начальное значение
		}, blockTime * 1000);
	}

	// Устанавливаем сообщение об ошибке (отложенно)
	setTimeout(() => {
		setError('code', {
			// type: 'manual', // ← рекомендуется добавлять
			message: errorMessage
		});
	}, 0);

	console.log('blockTime', blockTime);
};

// *********************************
// import { AppDispatch } from '@/app/providers/StoreProvider';
// import { authActions } from '@/features/auth';
// import { UseFormSetError } from 'react-hook-form';
// import { LoginCodeForm } from '../..';

// export const handleErrorResponse = async (
// 	currentAttempts: number,
// 	attemptCounter: number,
// 	setAttemptsNumber: React.Dispatch<React.SetStateAction<number>>,
// 	setAttemptCounter: React.Dispatch<React.SetStateAction<number>>,
// 	setTime: React.Dispatch<React.SetStateAction<number>>,
// 	dispatch: AppDispatch,
// 	setError: UseFormSetError<LoginCodeForm>
// ): Promise<void> => {
// 	// ← добавили возвращаемый тип
// 	// const { message = 'Произошла ошибка', block_duration_seconds } = errors;
// 	const MINUTES_BLOCK = 30; // 2 минуты
// 	const SECONDS_BLOCK = 10;
// 	const MAX_BLOCK_DURATION = 3600; // 1 час

// 	let blockTime: number;
// 	let errorMessage: string;
// 	let shouldBlock = false;
// 	// const attemptCounter = 0;

// 	console.log('currentAttempts in handleErrorResponse', currentAttempts);
// 	console.log('attemptCounter in handleErrorResponse', attemptCounter);

// 	if (currentAttempts <= 0 && attemptCounter > 0) {
// 		blockTime = MAX_BLOCK_DURATION;
// 		shouldBlock = true;
// 		errorMessage = 'Лимит исчерпан.';
// 		setAttemptsNumber(0);
// 	} else if (currentAttempts === 1) {
// 		// Последняя попытка
// 		blockTime = MINUTES_BLOCK;
// 		shouldBlock = true;
// 		errorMessage = 'Слишком много неверных попыток.';
// 		setAttemptsNumber(prev => prev - 1); // Используем функциональное обновление
// 		setAttemptCounter(prev => prev + 1);
// 	} else {
// 		// Обычная ошибка
// 		blockTime = SECONDS_BLOCK;
// 		errorMessage = `Код введен неверно. Осталось попыток: ${currentAttempts - 1}`;
// 		setAttemptsNumber(prev => prev - 1); // Используем функциональное обновление
// 	}

// 	// Блокируем аккаунт если нужно
// 	if (shouldBlock) {
// 		dispatch(authActions.disabledCodeAttempts(true));

// 		// Разблокировка через время
// 		setTimeout(() => {
// 			dispatch(authActions.disabledCodeAttempts(false));
// 			// setAttemptsNumber(5); // или начальное значение
// 		}, blockTime * 1000);
// 	}

// 	// Устанавливаем сообщение об ошибке (отложенно)
// 	setTimeout(() => {
// 		setError('code', {
// 			// type: 'manual', // ← рекомендуется добавлять
// 			message: errorMessage
// 		});
// 	}, 0);

// 	console.log('blockTime', blockTime);
// 	setTime(blockTime);
// };

// ******************************
// import { AppDispatch } from '@/app/providers/StoreProvider';
// import { authActions } from '@/features/auth';
// import { UseFormSetError } from 'react-hook-form';
// import { LoginCodeForm } from '../..';

// interface ErrorResponse {
// 	message?: string;
// 	block_duration_seconds?: number;
// }

// export const handleErrorResponse = async (
// 	errors: ErrorResponse,
// 	currentAttempts: number,
// 	setAttemptsNumber: React.Dispatch<React.SetStateAction<number>>, // ← исправленный тип
// 	setTime: (time: number) => void,
// 	dispatch: AppDispatch,
// 	setError: UseFormSetError<LoginCodeForm>
// ): Promise<void> => {
// 	// ← добавили возвращаемый тип
// 	const { message = 'Произошла ошибка', block_duration_seconds } = errors;
// 	const MINUTES_BLOCK = 120; // 2 минуты
// 	const SECONDS_BLOCK = 60;
// 	const MAX_BLOCK_DURATION = 3600; // 10 минут

// 	let blockTime: number;
// 	let errorMessage: string;
// 	let shouldBlock = false;
// 	let attemptCounter = 0;

// 	console.log('currentAttempts in handleErrorResponse', currentAttempts);

// 	if (currentAttempts <= 0) {
// 		// Уже заблокирован
// 		blockTime = block_duration_seconds || MAX_BLOCK_DURATION;
// 		shouldBlock = true;
// 		errorMessage = 'Ваш аккаунт заблокирован.';
// 	} else if (currentAttempts === 1) {
// 		// Последняя попытка
// 		blockTime = MINUTES_BLOCK;
// 		shouldBlock = true;
// 		errorMessage = message || 'Слишком много неверных попыток.';
// 		setAttemptsNumber(prev => prev - 1); // Используем функциональное обновление
// 	} else {
// 		// Обычная ошибка
// 		blockTime = SECONDS_BLOCK;
// 		errorMessage =
// 			message || `Код введен неверно. Осталось попыток: ${currentAttempts - 1}`;
// 		setAttemptsNumber(prev => prev - 1); // Используем функциональное обновление
// 	}

// 	// Блокируем аккаунт если нужно
// 	if (shouldBlock) {
// 		dispatch(authActions.disabledCodeAttempts(true));

// 		// Разблокировка через время
// 		setTimeout(() => {
// 			dispatch(authActions.disabledCodeAttempts(false));
// 			// Сбрасываем счетчик попыток после разблокировки
// 			// setAttemptsNumber(5); // или начальное значение
// 		}, blockTime * 1000);
// 	}

// 	// Устанавливаем сообщение об ошибке (отложенно)
// 	setTimeout(() => {
// 		setError('code', {
// 			type: 'manual', // ← рекомендуется добавлять
// 			message: message || errorMessage
// 		});
// 	}, 0);

// 	console.log('blockTime', blockTime);
// 	setTime(blockTime);
// };
