import React, { memo, useCallback, useRef, useState } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { ImageEditor, ImageEditorRef } from '@/shared/ui/AvatarEditor';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { Text, TextSize, TextTag, TextType, TitleTag } from '@/shared/ui/Text';
import { EditorFooter } from '../EditorFooter/EditorFooter';
import { validateImageFile } from '../../model/lib/validateImage/validateImage';
import cls from './AvatarUploader.module.scss';

export interface AvatarUploaderRef {
	openFilePicker: () => void;
	close: () => void;
}

interface AvatarUploaderProps {
	onAvatarChange: (file: File) => void;
	initialAvatar?: string | null;
	children?: React.ReactNode;
}

export const AvatarUploaderComponent = forwardRef<
	AvatarUploaderRef,
	AvatarUploaderProps
>(({ onAvatarChange, children }, ref) => {
	const editorRef = useRef<ImageEditorRef>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [originalFile, setOriginalFile] = useState<File | null>(null);

	const isMobile = useMediaQuery();

	const showError = useCallback((message: string) => {
		setError(message);
		setTimeout(() => setError(null), 5000);
	}, []);

	const handleFileSelect = useCallback(
		async (file: File) => {
			const validation = await validateImageFile(file);
			if (!validation.valid) {
				showError(validation.error!);
				return;
			}

			const dataUrl = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});

			setSelectedImage(dataUrl);
			setOriginalFile(file);
			setIsModalOpen(true);
		},
		[showError]
	);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				handleFileSelect(file);
			}
			e.target.value = ''; // Reset
		},
		[handleFileSelect]
	);

	const handleConfirm = useCallback(
		async (editedFile: File) => {
			if (!originalFile) {
				return showError('Файл потерян');
			}

			onAvatarChange(editedFile);
			setIsModalOpen(false);
			setSelectedImage(null);
			setOriginalFile(null);
		},
		[onAvatarChange, originalFile, showError]
	);

	const handleClose = useCallback(() => {
		setIsModalOpen(false);
		setSelectedImage(null);
		setOriginalFile(null);
	}, []);

	const openFilePicker = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			openFilePicker,
			close: handleClose
		}),
		[openFilePicker, handleClose]
	);

	return (
		<>
			{children}

			<input
				type='file'
				accept='image/jpeg,image/png,image/webp,image/avif'
				onChange={handleFileChange}
				ref={fileInputRef}
				className={cls.visuallyHidden}
				tabIndex={-1}
				aria-hidden='true'
			/>

			<Modal
				isOpen={isModalOpen}
				onClose={handleClose}
				size={isMobile ? 'mobileNarrow' : 'extraWide'}
				borderRadius={isMobile ? '8px' : '12px'}
				overlayClassName={isMobile ? cls.avatarModalOverlay : undefined}
			>
				{selectedImage && (
					<ImageEditor
						ref={editorRef}
						image={selectedImage}
						onClose={handleClose}
						onConfirm={handleConfirm}
					/>
				)}
			</Modal>

			{/* Mobile footer */}
			{isMobile && isModalOpen && (
				<EditorFooter
					onCancel={handleClose}
					onConfirm={() => editorRef.current?.confirm()}
				/>
			)}

			{/* Error modal */}
			{error && (
				<Modal
					isOpen={!!error}
					onClose={() => setError(null)}
					size='wide'
					borderRadius='8px'
				>
					<div className={cls.errorModalContent}>
						<Text type={TextType.TITLE} tag={TitleTag.H3} fontSize={TextSize.L}>
							Ошибка загрузки
						</Text>
						<Text type={TextType.TEXT} tag={TextTag.P} fontSize={TextSize.M}>
							{error}
						</Text>
						<Button
							onClick={() => setError(null)}
							color={ButtonColor.GREEN}
							className={cls.errorCloseBtn}
						>
							Закрыть
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
});

AvatarUploaderComponent.displayName = 'AvatarUploaderComponent';
export const AvatarUploader = memo(AvatarUploaderComponent);
