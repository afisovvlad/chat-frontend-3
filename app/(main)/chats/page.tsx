'use client';
import { Container, ContainerType } from '@/shared/ui/Container';
import {
	Text,
	TextAlign,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import cls from './chats.module.scss';

import { ChatsPage } from '@/pages/Chats';

import Image from 'next/image';
import { useState } from 'react';

const Chats = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isNewModalOpen, setNewIsModalOpen] = useState<boolean>(false);

	const onClose = () => setIsModalOpen(false);
	const NewModalClose = () => setNewIsModalOpen(false);

	const onConfirm = () => {
		setIsModalOpen(false);
		setNewIsModalOpen(false);
	};

	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				<div className={cls.placeholder}>
					{/* Тестовое наполнение — удалить в проде */}
					<input className={cls.input} />
					<div className={cls.mockChats}>
						{Array.from({ length: 72 }).map((_, i) => (
							<div key={i} className={cls.chatItem}>
								<div className={cls.avatar}></div>
								<div className={cls.info}>
									<Text type={TextType.TITLE} className={cls.name}>
										Пользователь {i + 1}
									</Text>
									<Text type={TextType.TEXT} className={cls.message}>
										Привет! Это заглушка сообщения.
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
					<Text
						color={TextColor.GRAY}
						fontSize={TextSize.L}
						textAlign={TextAlign.CENTER}
					>
						Сообщений пока нет
					</Text>
					<Text
						color={TextColor.GRAY}
						fontSize={TextSize.S}
						textAlign={TextAlign.CENTER}
					>
						Напишите первым :)
					</Text>
				</div>

				<ChatsPage />
			</Container>
		</Container>
	);
};

export default Chats;
