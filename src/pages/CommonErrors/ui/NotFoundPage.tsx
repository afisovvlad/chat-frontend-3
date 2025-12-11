import { Button } from '@/shared/ui/Button';
import { Container } from '@/shared/ui/Container';
import { NotFound } from '@icons/index';
import Link from 'next/link';
import cls from './CommonErrors.module.scss';

export const NotFoundPage = () => {
	return (
		<Container className={cls.container}>
			<NotFound className={cls.iconPage} />

			<div className={cls.text}>
				Проверьте правильность адреса или вернитесь на главную страницу
			</div>

			<Link href='/'>
				<Button className={cls.button}>Вернуться на главную</Button>
			</Link>
		</Container>
	);
};
