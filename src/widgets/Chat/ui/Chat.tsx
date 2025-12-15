'use client';

import { Text, TextType } from '@/shared/ui/Text';
import cls from './Chat.module.scss';

const Chat = () => {
	return (
		<div className={cls.placeholder}>
			{/* Тестовое наполнение — удалить в проде */}
			<input className={cls.input} />
			<div className={cls.mockChats}>
				{Array.from({ length: 8 }).map((_, i) => (
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
	);
};

export default Chat;
