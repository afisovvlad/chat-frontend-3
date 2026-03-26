'use client';

import { Form, Textarea } from '@/shared/ui/FormComponent';
import { KeyboardEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MessageFormTypes } from '../../model/types/types';
import { EmojiPickerComponent } from '../EmojiPickerComponent/EmojiPickerComponent';
import cls from './MessageForm.module.scss';

interface MessageFormProps {
	onSendContent: (message: string) => void;
	disabled?: boolean;
	onTextChanged?: (isFilled: boolean) => void;
}

export function MessageForm({
	onSendContent,
	disabled,
	onTextChanged
}: MessageFormProps) {
	const methods = useForm<MessageFormTypes>({
		defaultValues: { message: '' }
	});
	const { getValues, handleSubmit, reset, watch } = methods;
	const message = watch('message');
	const isFilled = message.trim().length > 0;

	//  Сообщаем родителю об изменении состояния "заполнено/пусто"
	useEffect(() => {
		onTextChanged?.(isFilled);
	}, [isFilled, onTextChanged]);

	// ─────────────────────────────────────────
	//  Авто-фокус при монтировании / смене disabled
	// ─────────────────────────────────────────
	useEffect(() => {
		if (disabled) {
			return;
		}

		const timer = setTimeout(() => {
			const textarea = document.querySelector<HTMLTextAreaElement>('#message');
			if (textarea) {
				textarea.focus();
				const len = textarea.value.length;
				textarea.setSelectionRange(len, len);
			}
		}, 0);

		return () => clearTimeout(timer);
	}, [disabled]);

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(onSubmit)();
		}
	};

	const onEmojiSelect = (emoji: string) => {
		const textarea = document.querySelector<HTMLTextAreaElement>('#message');
		if (!textarea) {
			return;
		}

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const current = getValues('message');
		const newMessage = current.slice(0, start) + emoji + current.slice(end);

		methods.setValue('message', newMessage, {
			shouldDirty: true,
			shouldTouch: true
		});

		requestAnimationFrame(() => {
			const cursor = start + emoji.length;
			textarea.selectionStart = cursor;
			textarea.selectionEnd = cursor;
			textarea.focus();
		});
	};

	const onSubmit = async (data: MessageFormTypes) => {
		const trimmed = data.message.trim();
		if (!trimmed) {
			return;
		}

		await onSendContent(trimmed);
		reset();
	};

	return (
		<Form<MessageFormTypes>
			methods={methods}
			onSubmit={onSubmit}
			className={cls.messageForm}
		>
			<div className={cls.textareaWrapper}>
				<Textarea
					name='message'
					classNameTextarea={cls.textarea}
					height='21px'
					onKeyDown={handleKeyDown}
					placeholder='Сообщение...'
					disabled={disabled}
				/>
				<EmojiPickerComponent
					onEmojiSelect={onEmojiSelect}
					disabled={disabled}
				/>
			</div>
		</Form>
	);
}
