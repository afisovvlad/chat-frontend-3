'use client';
import { useState } from 'react';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { Text, TextSize, TextType } from '@/shared/ui/Text';
import { Modal } from '@/shared/ui/Modal/ui/Modal';
import styles from './page.module.scss';

export default function HomePage() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const onClose = () => {
		setIsModalOpen(false);
	};

	const onConfirm = () => {
		//  логика удаления
		setIsModalOpen(false);
	};
	return (
		<section className={styles.homePage}>
			<Button onClick={() => setIsModalOpen(true)} className={styles.btn}>
				Удалить элемент
			</Button>

			<Modal
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
		</section>
	);
}
