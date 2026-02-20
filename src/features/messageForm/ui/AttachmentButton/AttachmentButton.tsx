// import { Button, ButtonColor } from '@/shared/ui/Button';
import { FileInput } from '@/shared/ui/FormComponent';
import { Paperclip } from '@icons/index';
import styles from './AttachmentButton.module.scss';

export function AttachmentButton() {
	return (
		<FileInput
			parentClass={styles.button}
			isHidden={true}
			aria-label='Прикрепить файл'
		>
			<Paperclip className={styles.icon} />
		</FileInput>
		// <Button
		// 	color={ButtonColor.TRANSPARENT}
		// 	className={styles.button}
		// 	aria-label='Прикрепить файл'
		// >
		// 	<Paperclip className={styles.icon} />
		// </Button>
	);
}
