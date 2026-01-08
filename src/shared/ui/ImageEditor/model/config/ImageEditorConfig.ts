import { ImageEditorConfig } from './types';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';

export const useImageEditorConfig = (): ImageEditorConfig => {
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const size = isDesktop ? 320 : 193;

	return {
		width: size,
		height: size,
		borderRadius: size / 2
	};
};
