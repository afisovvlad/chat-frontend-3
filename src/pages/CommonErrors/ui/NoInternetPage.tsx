'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { Container } from '@/shared/ui/Container';
import cls from './CommonErrors.module.scss';

import { NoInternet } from '@/shared/assets/icons';
import { Button } from '@/shared/ui/Button';

export const NoInternetPage = () => {
	return (
		<Container className={classNames(cls.container)}>
			<NoInternet className={cls.iconPage}></NoInternet>

			<div className={cls.text}>
				Нет доступа к интернету. Проверьте подключение сети и повторите запрос
			</div>

			<Button className={cls.button} onClick={() => window.location.reload()}>
				Перезагрузить страницу
			</Button>
		</Container>
	);
};
