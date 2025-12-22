'use client';

import { Text, TextType } from '@/shared/ui/Text';
import cls from './contacts.module.scss';
import {
	Container,
	ContainerTypeEnum,
	FlexContainer
} from '@/shared/ui/Container';
import Image from 'next/image';

const Contacts = () => {
	return (
		<FlexContainer>
			{/* Тестовое наполнение — удалить в проде */}
			<Container type={ContainerTypeEnum.LEFT}>
				<div className={cls.placeholder}>
					<div className={cls.header}>
						<Text type={TextType.TITLE} className={cls.title}>
							Контакты пользователей А-чата
						</Text>
						<div className={cls.searchBar}>
							<input placeholder='Поиск' className={cls.searchInput} />
						</div>
					</div>

					<div className={cls.contactList}>
						{Array.from({ length: 18 }).map((_, i) => (
							<div key={i} className={cls.contactItem}>
								<div className={cls.avatar}></div>
								<div className={cls.info}>
									<Text type={TextType.TITLE} className={cls.name}>
										Пользователь {i + 1}
									</Text>
									<Text type={TextType.TEXT} className={cls.status}>
										в сети
									</Text>
								</div>
							</div>
						))}
					</div>
				</div>
			</Container>
			<Container type={ContainerTypeEnum.RIGHT}>
				<div className={cls.rightCont}>
					<Image
						src='/images/png/img_frog Web.png'
						alt='Нет сообщений'
						width={200}
						height={200}
					/>
				</div>
			</Container>
		</FlexContainer>
	);
};

export default Contacts;
