'use client';

import { Text, TextType } from '@/shared/ui/Text';
import cls from './service.module.scss';

const Service = () => {
	return (
		<div className={cls.placeholder}>
			{/* Тестовое наполнение — удалить в проде */}
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
	);
};

export default Service;
