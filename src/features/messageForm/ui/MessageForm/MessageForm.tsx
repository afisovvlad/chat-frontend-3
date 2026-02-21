'use client';

import styles from './MessageForm.module.scss';
import { useForm } from 'react-hook-form';
import { MessageFormType } from '../../model/types/types';
import { EmojiPickerComponent } from '../EmojiPickerComponent/EmojiPickerComponent';
import { Form, Textarea } from '@/shared/ui/FormComponent';
import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
import { useState } from 'react';

export function MessageForm() {
	const [emoji, setEmoji] = useState('');
	const methods = useForm<MessageFormType>({
		defaultValues: {
			message: ''
		}
	});

	const onEmojiSelect = (emoji: string) => setEmoji(emoji);

	const onSubmit = (data: MessageFormType) => console.log(data);

	return (
		<Form<MessageFormType>
			methods={methods}
			onSubmit={onSubmit}
			className={styles.messageForm}
		>
			<AttachmentButton />
			<div className={styles.textareaWrapper}>
				<Textarea
					name={'message'}
					classNameTextarea={styles.textarea}
					height={'21px'}
				/>
				<EmojiPickerComponent onEmojiSelect={onEmojiSelect} />
			</div>
		</Form>
	);
}
