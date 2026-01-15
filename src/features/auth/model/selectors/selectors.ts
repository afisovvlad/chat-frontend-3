import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';

export const useAuthStep = () => {
	return useAppSelector(state => state.auth.step);
};
