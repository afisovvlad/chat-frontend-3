import React, { memo } from 'react';
import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState
} from 'react';
import { Modal } from '@/shared/ui/Modal';
import { ImageEditor, ImageEditorRef } from '@/shared/ui/AvatarEditor';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { ModalBorderRadius, ModalSize } from '@/shared/ui/Modal/model/type';
import { EditorFooter } from '../EditorFooter/EditorFooter';
import cls from './AvatarUploader.module.scss';

export interface AvatarUploaderRef {
	openFilePicker: () => void;
	close: () => void;
}

interface AvatarUploaderProps {
	onAvatarChange: (dataUrl: string) => void;
	initialAvatar?: string | null;
	children?: React.ReactNode;
}

export const AvatarUploaderComponent = forwardRef<
	AvatarUploaderRef,
	AvatarUploaderProps
>(({ onAvatarChange, initialAvatar, children }, ref) => {
	const editorRef = useRef<ImageEditorRef>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const modalContainerRef = useRef<HTMLDivElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [avatar, setAvatar] = useState<string | null>(initialAvatar ?? null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const isMobile = useMediaQuery();

	const modalBorderRadius: ModalBorderRadius = isMobile ? '8px' : '12px';
	const modalSize: ModalSize = isMobile ? 'mobileNarrow' : 'extraWide';

	const showError = (message: string) => {
		setError(message);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			e.target.value = '';
			return;
		}

		if (!file.type.startsWith('image/')) {
			showError('Пожалуйста, выберите изображение (JPEG, PNG и т.д.)');
			e.target.value = '';
			return;
		}

		// Опционально: ограничение размера
		if (file.size > 5 * 1024 * 1024) {
			showError('Размер файла не должен превышать 5 МБ');
			e.target.value = '';
			return;
		}

		const reader = new FileReader();
		reader.onload = event => {
			const dataUrl = event.target?.result as string;
			setSelectedImage(dataUrl);
			setIsModalOpen(true);
			e.target.value = '';
		};
		reader.readAsDataURL(file);
	};

	const handleConfirmClick = useCallback(() => {
		editorRef.current?.confirm();
	}, []);

	const handleConfirm = useCallback(
		(dataUrl: string) => {
			setAvatar(dataUrl);
			onAvatarChange(dataUrl);
			setIsModalOpen(false);
		},
		[onAvatarChange]
	);

	const handleClose = useCallback(() => {
		setIsModalOpen(false);
		setSelectedImage(null);
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
		[handleClose, openFilePicker]
	);

	return (
		<>
			{children}
			<input
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				ref={fileInputRef}
				className={cls.visuallyHidden}
				tabIndex={-1}
				aria-hidden='true'
			/>

			{isMobile && (
				<div ref={modalContainerRef} className={cls.modalContainer} />
			)}

			<Modal
				isOpen={isModalOpen}
				onClose={handleClose}
				size={modalSize}
				borderRadius={modalBorderRadius}
				containerRef={isMobile ? modalContainerRef : undefined}
				overlayClassName={isMobile ? cls.avatarModalOverlay : undefined}
			>
				{selectedImage && isModalOpen && (
					<ImageEditor
						ref={editorRef}
						image={selectedImage}
						onClose={handleClose}
						onConfirm={handleConfirm}
					/>
				)}
			</Modal>

			{isMobile && isModalOpen && (
				<EditorFooter onCancel={handleClose} onConfirm={handleConfirmClick} />
			)}
			{/* Модальное окно ошибки */}
			{error && (
				<Modal
					isOpen={!!error}
					onClose={() => setError(null)}
					closeButton
					size='wide'
					borderRadius='8px'
				>
					<div className={cls.errorModalContent}>
						<h3 className={cls.errorTitle}>Ошибка загрузки</h3>
						<p className={cls.errorMessage}>{error}</p>
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

AvatarUploaderComponent.displayName = 'AvatarUploader';

export const AvatarUploader = memo(AvatarUploaderComponent);
