'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { Container } from '@/shared/ui/Container';
import cls from './CommonErrors.module.scss';

import { NoInternet } from '@icons/index';
import { Button } from '@/shared/ui/Button';
import { Text, TextColor, TextSize } from '@/shared/ui/Text';

export const NoInternetPage = () => {
	return (
		<Container className={classNames(cls.container)}>
			<NoInternet className={cls.iconPage}></NoInternet>

			<Text
				className={cls.text}
				fontSize={TextSize.M}
				color={TextColor.GRAY}
				lineHeight={1.3}
			>
				Нет доступа к интернету. Проверьте подключение сети и повторите запрос
			</Text>

			<Button className={cls.button} onClick={() => window.location.reload()}>
				Перезагрузить страницу
			</Button>
		</Container>
	);
};
