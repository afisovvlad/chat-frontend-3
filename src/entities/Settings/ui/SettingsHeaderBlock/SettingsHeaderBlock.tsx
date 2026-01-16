import { classNames } from '@/shared/lib/classNames/classNames';
import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import { Back, Left } from '@icons/index';
import Link from 'next/link';
import styles from './SettingsHeaderBlock.module.scss';

export interface SettingsHeaderBlockProps {
	title: string;
	href?: string;
	parentClass?: string;
}

export function SettingsHeaderBlock({
	title,
	href,
	parentClass
}: SettingsHeaderBlockProps) {
	return (
		<div className={classNames(styles.headerBlock, {}, [parentClass])}>
			{href && (
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
		</div>
	);
}
