'use client';

import { authActions, TimeLeft, useSetAuthStep } from '@/features/auth';
import { classNames } from '@/shared/lib/classNames/classNames';
import { formatPhone } from '@/shared/lib/formatPhone/formatPhone';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import { Button } from '@/shared/ui/Button';
import {
	ButtonColor,
	ButtonFontSize,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button/model/type';
import {
	FontWeight,
	Text,
	TextAlign,
	TextColor,
	TextSize,
	TextTag,
	TextType
} from '@/shared/ui/Text';
import { InfoCircle } from '@icons/index';
import { useEffect, useState } from 'react';
import { EnterCodeForm } from '../..';
import TooltipWrapper from '../TooltipWrapper';
import styles from './EnterCode.module.scss';

export const EnterCode = () => {
	const {
		phone_number,
		code_len,
		is_filled,
		isDisabledCodeAttempts,
		blockingTime
	} = useAppSelector(state => state.auth);
	const [time, setTime] = useState<number>(60);
	const [finishedTime, setFinishedTime] = useState(false);
	const dispatch = useAppDispatch();
	const setStep = useSetAuthStep();
	const formattedPhone = formatPhone(phone_number);

	console.log('time in EnterCode', time);
	console.log('finishedTime', finishedTime);

	// useEffect(() => {
	// 	if (finishedTime) {
	// 		dispatch(authActions.setBlockingTime(0));
	// 	}
	// }, [finishedTime, dispatch]);

	useEffect(() => {
		if (isDisabledCodeAttempts && finishedTime) {
			console.log(
				'isDisabledCodeAttempts && finishedTime',
				isDisabledCodeAttempts && finishedTime
			);
			dispatch(authActions.disabledCodeAttempts(false));
		}
	}, [finishedTime, isDisabledCodeAttempts, dispatch]);

	return (
		<div className={styles.loginCode}>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.REGULAR}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={styles.messageText}
			>
				Код подтверждения отправлен на следующий номер:
			</Text>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.MEDIUM}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={classNames(`${styles.phoneText} ${styles.boldText}`, {}, [])}
			>
				{formattedPhone}
			</Text>

			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.MEDIUM}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={classNames(`${styles.infoText} ${styles.boldText}`, {}, [])}
			>
				Введите код&nbsp;
				<InfoCircle width={24} height={24} className={styles.infoIcon} />
			</Text>

			<TooltipWrapper />

			<EnterCodeForm
				setTime={setTime}
				phone_number={phone_number}
				code_len={code_len}
				is_filled={is_filled}
				disabled={isDisabledCodeAttempts}
				finishedTime={finishedTime}
				// setAttemptCounter={setAttemptCounter}
			/>
			{!finishedTime ? (
				<Text
					type={TextType.TEXT}
					tag={TextTag.P}
					fontSize={TextSize.L}
					fontWeight={FontWeight.MEDIUM}
					textAlign={TextAlign.CENTER}
					color={TextColor.GRAY}
					className={styles.timer}
				>
					Отправить новый код через&nbsp;
					<TimeLeft initialTime={time} setFinishedTime={setFinishedTime} />
				</Text>
			) : (
				<Button
					btnType={ButtonType.BUTTON}
					fontSize={ButtonFontSize.M}
					disabled={false}
					theme={ButtonTheme.CLEAR}
					color={ButtonColor.PRIMARY}
					className={styles.newCode}
					onClick={() => {
						setTime(time);
						setFinishedTime(false);
					}}
				>
					Отправить новый код
				</Button>
			)}
			<Button
				onClick={() => {
					setStep('support');
				}}
				btnType={ButtonType.BUTTON}
				theme={ButtonTheme.CLEAR}
				color={ButtonColor.PRIMARY}
				fontSize={ButtonFontSize.M}
				className={styles.btn}
			>
				Не приходит код?
			</Button>
		</div>
	);
};
