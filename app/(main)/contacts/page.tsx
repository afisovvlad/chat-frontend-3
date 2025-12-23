'use client';
import { Text, TextType } from '@/shared/ui/Text';
import { Container, ContainerType } from '@/shared/ui/Container';
import Image from 'next/image';
import cls from './contacts.module.scss';

const Contacts = () => {
	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				{/* Тестовое наполнение — удалить в проде */}
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
			<Container type={ContainerType.CONTENT}>
				<div className={cls.rightCont}>
					<Image
						src='/images/png/img_frog Web.png'
						alt='Нет сообщений'
						width={200}
						height={200}
					/>
				</div>
			</Container>
		</Container>
	);
};

export default Contacts;
