import styles from './SettingsHeaderBlock.module.scss';
import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import { Back, Left, MenuIcon } from '@icons/index';
import Link from 'next/link';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button, ButtonTheme } from '@/shared/ui/Button';

export interface SettingsHeaderBlockProps {
	title: string;
	href?: string;
	parentClass?: string;
	iconLeft?: boolean;
	iconRight?: boolean;
	onClick?: () => void;
}

export function SettingsHeaderBlock({
	title,
	href,
	parentClass,
	iconLeft,
	iconRight,
	onClick
}: SettingsHeaderBlockProps) {
	return (
		<div className={classNames(styles.headerBlock, {}, [parentClass])}>
			{iconLeft && href && (
				<Link href={href} className={styles.leftBlock}>
					<Back className={styles.back} />
					<Left className={styles.left} />
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
