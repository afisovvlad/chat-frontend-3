'use client';

import { Form, Textarea } from '@/shared/ui/FormComponent';
import { KeyboardEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageFormType } from '../../model/types/types';
import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
import { EmojiPickerComponent } from '../EmojiPickerComponent/EmojiPickerComponent';
import styles from './MessageForm.module.scss';

export function MessageForm() {
	const methods = useForm<MessageFormType>({
		defaultValues: {
			message: ''
		}
	});
	const { setValue, getValues, handleSubmit } = methods;

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(onSubmit)();
		}
		// При Shift+Enter оставляем стандартное поведение (перевод строки)
	};

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
					onKeyDown={handleKeyDown}
				/>
				<EmojiPickerComponent onEmojiSelect={onEmojiSelect} />
			</div>
		</Form>
	);
}
