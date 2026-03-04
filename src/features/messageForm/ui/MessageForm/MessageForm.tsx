'use client';

import { Form, Textarea } from '@/shared/ui/FormComponent';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageFormType } from '../../model/types/types';
import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
import { EmojiPickerComponent } from '../EmojiPickerComponent/EmojiPickerComponent';
import styles from './MessageForm.module.scss';

export function MessageForm() {
	const [emoji, setEmoji] = useState('');
	const methods = useForm<MessageFormType>({
		defaultValues: {
			message: ''
		}
	});
	const { setValue, getValues } = methods;

	const onEmojiSelect = (emoji: string) => {
		const currentMessage = getValues('message');
		setValue('message', currentMessage + emoji, {
			shouldDirty: true,
			shouldTouch: true
		});
	};

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
