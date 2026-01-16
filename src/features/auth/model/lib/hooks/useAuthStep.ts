import { selectAuthStep } from '@/features/auth';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';

export const useAuthStep = () => {
	return useAppSelector(selectAuthStep);
};
