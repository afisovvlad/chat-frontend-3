import styles from './MessageForm.module.scss';
import { useForm } from 'react-hook-form';
import { MessageFormType } from '../../model/types/types';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';
import { Form, Textarea } from '@/shared/ui/FormComponent';

export function MessageForm() {
	const methods = useForm<MessageFormType>({
		defaultValues: {
			message: ''
		}
	});

	const onSubmit = (data: MessageFormType) => console.log(data);

	return (
		<Form<MessageFormType>
			methods={methods}
			onSubmit={onSubmit}
			className={styles.messageForm}
		>
			<Textarea name={'message'} classNameTextarea={styles.textarea} />
			<EmojiPicker />
		</Form>
	);
}
