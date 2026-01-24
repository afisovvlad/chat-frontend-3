import { useMemo } from 'react';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { ImageEditorConfig } from '@/shared/ui/AvatarEditor';

export const useImageEditorConfig = (): ImageEditorConfig => {
	const isDesktop = useMediaQuery('(min-width: 768px)');
	return useMemo(() => {
		const size = isDesktop ? 320 : 193;
		return {
			width: size,
			height: size,
			borderRadius: size / 2
		};
	}, [isDesktop]);
};
