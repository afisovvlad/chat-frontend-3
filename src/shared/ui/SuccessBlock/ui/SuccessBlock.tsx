'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
	FontWeight,
	Text,
	TextAlign,
	TextColor,
	TextSize,
	TextTag,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import { Success } from '@icons/index';
import styles from './SuccessBlock.module.scss';

export interface SuccessBlockProps {
	marginTop?: string;
	title: string;
	text?: string;
	redirectUrl?: string;
	redirectDelay?: number;
}

export function SuccessBlock({
	marginTop,
	title,
	text,
	redirectUrl,
	redirectDelay = 3000
}: SuccessBlockProps) {
	const [countdown, setCountdown] = useState(Math.ceil(redirectDelay / 1000));
	const router = useRouter();

	useEffect(() => {
		if (!redirectUrl || countdown <= 0) {
			return;
		}

		const timer = setInterval(() => {
			setCountdown(prev => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [redirectUrl, countdown]);

	useEffect(() => {
		if (redirectUrl && countdown <= 0) {
			router.push(redirectUrl);
		}
	}, [redirectUrl, countdown, router]);

	return (
		<div className={styles.successBlock} style={{ marginTop: marginTop }}>
			<Success width={66.7} height={66.7} className={styles.successIcon} />

			<Text
				type={TextType.TITLE}
				tag={TitleTag.H2}
				fontSize={TextSize.XL}
				fontWeight={FontWeight.MEDIUM}
				textAlign={TextAlign.CENTER}
				className={styles.successTitle}
			>
				{title}
			</Text>

			{text && (
				<Text
					type={TextType.TEXT}
					tag={TextTag.P}
					fontSize={TextSize.L}
					fontWeight={FontWeight.REGULAR}
					textAlign={TextAlign.CENTER}
					color={TextColor.BLACK}
					className={styles.successText}
				>
					{text} {countdown > 0 && `(${countdown}с)`}
				</Text>
			)}
		</div>
	);
}
