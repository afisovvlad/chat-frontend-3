'use client';
import { useState } from 'react';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { Text, TextSize, TextType } from '@/shared/ui/Text';
import { Modal } from '@/shared/ui/Modal';

import cls from './page.module.scss';

export default function HomePage() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isNewModalOpen, setNewIsModalOpen] = useState<boolean>(false);
	const onClose = () => {
		setIsModalOpen(false);
	};

	const NewModalClose = () => {
		setNewIsModalOpen(false);
	};

	const onConfirm = () => {
		//  логика удаления
		setIsModalOpen(false);
		setNewIsModalOpen(false);
	};
	return (
		<section className={cls.homePage}>
			<Button onClick={() => setIsModalOpen(true)} className={cls.btn}>
				Удалить элемент
			</Button>

			<Button onClick={() => setNewIsModalOpen(true)} className={cls.btn}>
				Новая Модалка
			</Button>

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
					Вы действительно хотите удалить собщение?.
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
				<Text type={TextType.TITLE}>some text</Text>
				<Text>
					В процессе разработки проекта мы столкнулись с рядом интересных задач.
					Команда профессионалов тщательно анализирует каждый аспект, чтобы
					обеспечить высокое качество результата. Используем современные
					технологии и проверенные методики. Особое внимание уделяем
					пользовательскому опыту и удобству интерфейса.{' '}
				</Text>

				<Text>
					В процессе разработки проекта мы столкнулись с рядом интересных задач.
					Команда профессионалов тщательно анализирует каждый аспект, чтобы
					обеспечить высокое качество результата. Используем современные
					технологии и проверенные методики. Особое внимание уделяем
					пользовательскому опыту и удобству интерфейса.{' '}
				</Text>
				<Text>
					В процессе разработки проекта мы столкнулись с рядом интересных задач.
					Команда профессионалов тщательно анализирует каждый аспект, чтобы
					обеспечить высокое качество результата. Используем современные
					технологии и проверенные методики. Особое внимание уделяем
					пользовательскому опыту и удобству интерфейса.{' '}
				</Text>
				<input type='checkbox' className={cls.checkbox} />
			</Modal>
		</section>
	);
}
