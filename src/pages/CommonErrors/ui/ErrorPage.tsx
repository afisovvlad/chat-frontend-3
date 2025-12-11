'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { Button } from '@/shared/ui/Button';
import { Container } from '@/shared/ui/Container';
import { Text, TextColor, TextSize } from '@/shared/ui/Text';
import { Error } from '@icons/index';
import cls from './CommonErrors.module.scss';

export const ErrorPage = () => {
	return (
		<Container className={classNames(cls.container)}>
			<Error className={cls.iconPage}></Error>

			<Text
				className={cls.text}
				fontSize={TextSize.M}
				color={TextColor.GRAY}
				lineHeight={1.3}
			>
				Похоже, возникла техническая проблема. Попробуйте обновить страницу
			</Text>

			<Button className={cls.button} onClick={() => window.location.reload()}>
				Перезагрузить страницу
			</Button>
		</Container>
	);
};
