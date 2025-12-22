'use client';

import { Text, TextType } from '@/shared/ui/Text';
import {
	Container,
	ContainerTypeEnum,
	FlexContainer
} from '@/shared/ui/Container';

import cls from './chats.module.scss';

import Image from 'next/image';
import {
	TextAlign,
	TextColor,
	TextSize
} from '../../../src/shared/ui/Text/model/types/enums';

const Chats = () => {
	return (
		<FlexContainer>
			<Container type={ContainerTypeEnum.LEFT}>
				<div className={cls.placeholder}>
					{/* Тестовое наполнение — удалить в проде */}
					<input className={cls.input} />
					<div className={cls.mockChats}>
						{Array.from({ length: 12 }).map((_, i) => (
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
			<Container type={ContainerTypeEnum.RIGHT}>
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
			</Container>
		</FlexContainer>
	);
};

export default Chats;
