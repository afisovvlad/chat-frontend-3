import { AuthStep } from './authStep';

export interface AuthSchema {
	step: AuthStep;
	stepHistory: AuthStep[];
	isRefreshing: boolean;
	phone_number?: string;
	// code_len?: number;
	// code: string;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
	isDisabledCodeAttempts: boolean;
	is_filled: boolean;
	blockingTime: number | undefined;
	attemptCounter: number;
}
