'use client';

import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import { Back, Left, MenuIcon } from '@icons/index';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HeaderBlockProps } from '..';
import styles from './HeaderBlock.module.scss';
import { Button, ButtonTheme } from '../../Button';

export function HeaderBlock({
	title,
	href,
	parentClass,
	iconLeft,
	iconRight,
	onClick
}: HeaderBlockProps) {
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const handleResize = () => {
			setWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className={clsx(parentClass, styles.headerBlock)}>
			{iconLeft && (
				<Link href={href} className={styles.leftBlock}>
					{width < 768 ? (
						<Back className={styles.back} />
					) : (
						<Left className={styles.left} />
					)}
				</Link>
			)}

			<Text
				type={TextType.TITLE}
				tag={TitleTag.H1}
				fontSize={TextSize.L}
				fontWeight={FontWeight.MEDIUM}
				color={TextColor.BLACK}
				className={styles.title}
			>
				{title}
			</Text>
			{iconRight && (
				<Button
					theme={ButtonTheme.CLEAR}
					className={styles.rightBlock}
					onClick={onClick}
				>
					<MenuIcon className={styles.menu} />
				</Button>
			)}
		</div>
	);
}
