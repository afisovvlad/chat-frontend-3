'use client';
import { useState } from 'react';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { Text, TextSize, TextType } from '@/shared/ui/Text';

import styles from './page.module.scss';
import { Modal } from '@/shared/ui/Modal';

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
		<section className={styles.homePage}>
			<Button onClick={() => setIsModalOpen(true)} className={styles.btn}>
				Удалить элемент
			</Button>

			<Button onClick={() => setNewIsModalOpen(true)} className={styles.btn}>
				Новая Модалка
			</Button>

			<Modal
				size='extraWide'
				isOpen={isModalOpen}
				onClose={onClose}
				closeButton
				className={styles.modal}
			>
				<Text
					type={TextType.TITLE}
					fontSize={TextSize.L}
					className={styles.modalTitle}
				>
					Удалить сообщение
				</Text>
				<Text
					type={TextType.TEXT}
					fontSize={TextSize.M}
					className={styles.modalText}
				>
					Вы действительно хотите удалить собщение?.
				</Text>

				<Modal.Actions className={styles.actions}>
					<Button
						color={ButtonColor.TRANSPARENT}
						onClick={onClose}
						className={styles.btnCancel}
					>
						Отмена
					</Button>
					<Button
						color={ButtonColor.PRIMARY}
						onClick={onConfirm}
						className={styles.btnDelete}
					>
						Удалить
					</Button>
				</Modal.Actions>
			</Modal>

			<Modal
				size='wide'
				isOpen={isNewModalOpen}
				onClose={NewModalClose}
				className={styles.newModal}
			>
				<Text type={TextType.TITLE}>some text</Text>
				<Text>
					В процессе разработки проекта мы столкнулись с рядом интересных задач.
					Команда профессионалов тщательно анализирует каждый аспект, чтобы
					обеспечить высокое качество результата. Используем современные
					технологии и проверенные методики. Особое внимание уделяем
					пользовательскому опыту и удобству интерфейса.{' '}
				</Text>
			</Modal>
		</section>
	);
}
