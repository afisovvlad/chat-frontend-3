import { RootState } from '@/app/providers/StoreProvider';

export const selectAuthStep = (state: RootState) => {
	return state.auth.step;
};
