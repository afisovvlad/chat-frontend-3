import { Smile } from '@icons/index';
import styles from './EmojiPicker.module.scss';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { classNames } from '@/shared/lib/classNames/classNames';

interface EmojiPickerProps {
	parentClass?: string;
}

export function EmojiPicker({ parentClass }: EmojiPickerProps) {
	return (
		<Button
			color={ButtonColor.TRANSPARENT}
			className={classNames(styles.button, {}, [parentClass])}
			aria-label='Прикрепить файл'
		>
			<Smile />
		</Button>
	);
}
