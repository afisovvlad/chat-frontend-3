'use client';

import { Button, ButtonColor, ButtonTheme } from '@/shared/ui/Button';
import { Paperclip } from '@icons/index';
import { useRef } from 'react';
import { VoiceFile } from '../../model/types/types';
import { blobToBase64 } from '../../model/lib/blobToBase64';
import cls from './AttachmentButton.module.scss';

interface AttachmentButtonProps {
	setFiles: (files: VoiceFile[]) => void;
	disabled?: boolean;
}

export function AttachmentButton({
	setFiles,
	disabled
}: AttachmentButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			return;
		}

		try {
			const base64 = await blobToBase64(file);
			setFiles([
				{
					filename: file.name,
					data: base64,
					type: file.type
				}
			]);
		} catch (error) {
			console.error('File conversion error:', error);
		}

		// Сброс input для повторного выбора того же файла
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<>
			<Button
				theme={ButtonTheme.CIRCLE}
				color={ButtonColor.TRANSPARENT}
				className={cls.button}
				aria-label='Выбрать файл'
				onClick={() => fileInputRef.current?.click()}
				disabled={disabled}
			>
				<Paperclip className={cls.icon} />
			</Button>
			<input
				type='file'
				ref={fileInputRef}
				className={cls.visuallyHidden}
				onChange={handleFileSelect}
				accept='image/*,audio/*,video/*,.pdf,.doc,.docx'
				disabled={disabled}
			/>
		</>
	);
}
