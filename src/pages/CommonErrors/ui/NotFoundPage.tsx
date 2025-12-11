import { Button } from '@/shared/ui/Button';
import { Container } from '@/shared/ui/Container';
import { Text, TextColor, TextSize } from '@/shared/ui/Text';
import { NotFound } from '@icons/index';
import Link from 'next/link';
import cls from './CommonErrors.module.scss';

export const NotFoundPage = () => {
	return (
		<Container className={cls.container}>
			<NotFound className={cls.iconPage} />

			<Text
				className={cls.text}
				fontSize={TextSize.M}
				color={TextColor.GRAY}
				lineHeight={1.3}
			>
				Проверьте правильность адреса или вернитесь на главную страницу
			</Text>

			<Link href='/'>
				<Button className={cls.button}>Вернуться на главную</Button>
			</Link>
		</Container>
	);
};
