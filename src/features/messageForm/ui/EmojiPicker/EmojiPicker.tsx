import { Smile } from '@icons/index';
import styles from './EmojiPicker.module.scss';
import { Button, ButtonColor } from '@/shared/ui/Button';

export function EmojiPicker() {
	return (
		<Button
			color={ButtonColor.TRANSPARENT}
			className={styles.button}
			aria-label='Прикрепить файл'
		>
			<Smile />
		</Button>
	);
}
