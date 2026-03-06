'use client';

import { Button, ButtonColor } from '@/shared/ui/Button';
import { Paperclip } from '@icons/index';
import { useState } from 'react';
import styles from './AttachmentButton.module.scss';
import { FilePayload } from '../../model/types/types';

interface AttachmentButtonProps {
	setFile: (file: FilePayload[]) => void;
}

export function AttachmentButton({ setFile }: AttachmentButtonProps) {
	const [showPopup, setShowPopup] = useState(false);

	return (
		// <FileInput
		// 	parentClass={styles.button}
		// 	isHidden={true}
		// 	aria-label='Прикрепить файл'
		// >
		// 	<Paperclip className={styles.icon} />
		// </FileInput>

		<Button
			color={ButtonColor.TRANSPARENT}
			className={styles.button}
			aria-label='Выбрать файл'
			onClick={() => {}}
		>
			<Paperclip className={styles.icon} />
		</Button>
	);
}
