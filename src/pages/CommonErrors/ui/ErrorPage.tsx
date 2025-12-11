'use client';

import { Error } from '@/shared/assets/icons';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button } from '@/shared/ui/Button';
import { Container } from '@/shared/ui/Container';
import cls from './CommonErrors.module.scss';

export const ErrorPage = () => {
	return (
		<Container className={classNames(cls.container)}>
			<Error className={cls.iconPage}></Error>

			<div className={cls.text}>
				Похоже, возникла техническая проблема. Попробуйте обновить страницу
			</div>

			<Button className={cls.button} onClick={() => window.location.reload()}>
				Перезагрузить страницу
			</Button>
		</Container>
	);
};
