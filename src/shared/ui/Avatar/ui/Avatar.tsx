import { classNames } from '@/shared/lib/classNames/classNames';
import { ProfileAvatar } from '@icons/index';
import Image from 'next/image';
import { CSSProperties } from 'react';
import cls from './Avatar.module.scss';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';

interface AvatarProps {
	className?: string;
	src?: string;
	size?: number;
	alt?: string;
	variant: 'card' | 'full';
}

export const Avatar = ({
	className,
	src,
	size = 60,
	alt,
	variant = 'card' // По умолчанию круглый для карточек
}: AvatarProps) => {
	const isMobile = useMediaQuery();

	//  Логика формы
	const isSquare = isMobile && variant === 'full';

	const styles: CSSProperties = {
		width: isSquare ? '100%' : size,
		height: isSquare ? 'auto' : size,
		aspectRatio: isSquare ? '1' : undefined,
		borderRadius: isSquare ? 12 : '50%'
	};

	return (
		<div
			className={classNames(cls.avatar, { [cls.square]: isSquare }, [
				className
			])}
			style={styles}
		>
			{src ? (
				<Image fill alt={alt || 'Аватар'} src={src} className={cls.image} />
			) : (
				<ProfileAvatar />
			)}
		</div>
	);
};
