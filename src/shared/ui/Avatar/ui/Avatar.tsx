import { classNames } from '@/shared/lib/classNames/classNames';
import { ProfileAvatar } from '@icons/index';
import Image from 'next/image';
import { CSSProperties } from 'react';
import cls from './Avatar.module.scss';

interface AvatarProps {
	className?: string;
	src?: string;
	size?: number;
	alt?: string;
}

export const Avatar = ({ className, src, size, alt }: AvatarProps) => {
	const styles: CSSProperties = {
		width: size || 60,
		height: size || 60
	};

	return (
		<div className={classNames(cls.Avatar, {}, [className])} style={styles}>
			{src ? (
				<Image fill={true} alt={alt || 'Аватар'} src={src} />
			) : (
				<ProfileAvatar />
			)}
		</div>
	);
};
