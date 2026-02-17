import { Form } from '@/shared/ui/FormComponent/Form/ui/Form';
import { useForm } from 'react-hook-form';
import { MessageFormType } from '../../model/types/types';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';
import styles from './MessageForm.module.scss';

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
			<EmojiPicker />
		</Form>
	);
}
