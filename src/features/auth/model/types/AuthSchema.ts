export interface AuthSchema {
	isRefreshing: boolean;
	phone: string;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}
