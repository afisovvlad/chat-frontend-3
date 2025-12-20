'use client';

import { Text, TextSize, TextType } from '@/shared/ui/Text';
import { Modal } from '@/shared/ui/Modal';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { useState } from 'react';

import cls from './chats.module.scss';

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
		<div className={cls.container}>
			{/* === Левая панель: список чатов === */}
			<div className={cls.chatPanel}>
				<input className={cls.input} placeholder='Поиск чатов...' />

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

			{/* === Правая панель: кнопки управления (вне чата!) === */}
			<div className={cls.controlsPanel}>
				<Button onClick={() => setIsModalOpen(true)} className={cls.btn}>
					Удалить элемент
				</Button>
				<Button onClick={() => setNewIsModalOpen(true)} className={cls.btn}>
					Новая Модалка
				</Button>
			</div>

			{/* === Модальные окна (рендерятся вне потока макета) === */}
			<Modal
				size='wide'
				isOpen={isModalOpen}
				onClose={onClose}
				closeButton
				className={cls.modal}
			>
				<Text
					type={TextType.TITLE}
					fontSize={TextSize.L}
					className={cls.modalTitle}
				>
					Удалить сообщение
				</Text>
				<Text
					type={TextType.TEXT}
					fontSize={TextSize.M}
					className={cls.modalText}
				>
					Вы действительно хотите удалить сообщение?
				</Text>
				<Modal.Actions className={cls.actions}>
					<Button
						color={ButtonColor.TRANSPARENT}
						onClick={onClose}
						className={cls.btnCancel}
					>
						Отмена
					</Button>
					<Button
						color={ButtonColor.PRIMARY}
						onClick={onConfirm}
						className={cls.btnDelete}
					>
						Удалить
					</Button>
				</Modal.Actions>
			</Modal>

			<Modal
				size='wide'
				isOpen={isNewModalOpen}
				onClose={NewModalClose}
				className={cls.newModal}
			>
				<Text type={TextType.TITLE}>Некоторый заголовок</Text>
				<Text>
					В процессе разработки проекта мы столкнулись с рядом интересных задач.
					Команда профессионалов тщательно анализирует каждый аспект, чтобы
					обеспечить высокое качество результата. Используем современные
					технологии и проверенные методики. Особое внимание уделяем
					пользовательскому опыту и удобству интерфейса.
				</Text>
				<Text>
					В процессе разработки проекта мы столкнулись с рядом интересных задач.
					Команда профессионалов тщательно анализирует каждый аспект, чтобы
					обеспечить высокое качество результата. Используем современные
					технологии и проверенные методики. Особое внимание уделяем
					пользовательскому опыту и удобству интерфейса.
				</Text>
				<Text>
					В процессе разработки проекта мы столкнулись с рядом интересных задач.
					Команда профессионалов тщательно анализирует каждый аспект, чтобы
					обеспечить высокое качество результата. Используем современные
					технологии и проверенные методики. Особое внимание уделяем
					пользовательскому опыту и удобству интерфейса.
				</Text>
				<input type='checkbox' className={cls.checkbox} />
			</Modal>
		</div>
	);
};

export default Chats;
