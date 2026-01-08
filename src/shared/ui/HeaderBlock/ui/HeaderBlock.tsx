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
import { HeaderBlockProps } from '..';
import { Button, ButtonTheme } from '../../Button';
import styles from './HeaderBlock.module.scss';

export function HeaderBlock({
	title,
	href,
	parentClass,
	iconLeft,
	iconRight,
	onClick
}: HeaderBlockProps) {
	return (
		<div className={clsx(parentClass, styles.headerBlock)}>
			{iconLeft && (
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
