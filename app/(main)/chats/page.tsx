'use client';
import { Text, TextAlign, TextColor, TextSize } from '@/shared/ui/Text';
import { Container, ContainerType } from '@/shared/ui/Container';
import Image from 'next/image';
import cls from './chats.module.scss';
import { ChatsPage } from '@/pages/Chats';
const Chats = () => {
	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				<ChatsPage />
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
			</Container>
		</Container>
	);
};

export default Chats;
