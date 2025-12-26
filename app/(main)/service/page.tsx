'use client';
import { Text, TextType } from '@/shared/ui/Text';
import { Container, ContainerType } from '@/shared/ui/Container';

import cls from './service.module.scss';

const Service = () => {
	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				{/* Тестовое наполнение — удалить в проде */}
				<div className={cls.placeholder}>
					<Text type={TextType.TITLE} className={cls.title}>
						Сервисы
					</Text>
					<div className={cls.servicesGrid}>
						{['Оплата', 'Доставка', 'Гарантия', 'Обмен'].map((service, i) => (
							<div key={i} className={cls.serviceCard}>
								<Text type={TextType.TITLE}>{service}</Text>
								<Text type={TextType.TEXT}>Подробнее →</Text>
							</div>
						))}
					</div>
				</div>
			</Container>

			<Container type={ContainerType.CONTENT}>
				<div className={cls.rightCont}></div>
			</Container>
		</Container>
	);
};

export default Service;
