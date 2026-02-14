'use client';

import { Button } from '@/shared/ui/Button';
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
import { Logo } from '@icons/index';
import styles from './LoginGreeting.module.scss';
import { useSetAuthStep } from '@/features/auth';
import { useRef, useCallback, useEffect } from 'react';

export const LoginGreeting = () => {
	const setStep = useSetAuthStep();

	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleStart = useCallback(() => {
		setStep('phone');
	}, [setStep]);

	useEffect(() => {
		buttonRef.current?.focus();
	}, []);

	return (
		<>
			<Logo className={styles.logo} />
			<Text
				type={TextType.TITLE}
				tag={TitleTag.H1}
				fontWeight={FontWeight.SEMI_BOLD}
				textAlign={TextAlign.CENTER}
				className={styles.title}
			>
				А-Чат
			</Text>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.REGULAR}
				textAlign={TextAlign.CENTER}
				color={TextColor.VIOLET}
				className={styles.text}
			>
				Привет!
			</Text>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.REGULAR}
				textAlign={TextAlign.CENTER}
				color={TextColor.VIOLET}
				className={styles.text}
			>
				Давай знакомиться
			</Text>
			<Button
				onClick={handleStart}
				btnRef={buttonRef}
				className={styles.btn}
				ariaLabel='Начать регистрацию'
			>
				Начать
			</Button>
		</>
	);
};
