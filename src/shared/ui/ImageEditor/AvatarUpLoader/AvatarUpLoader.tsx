import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ImageEditor, ImageEditorRef } from '@/shared/ui/ImageEditor';
import { Button, ButtonColor, ButtonTheme } from '@/shared/ui/Button';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
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

export const AvatarUploader = forwardRef<
	AvatarUploaderRef,
	AvatarUploaderProps
>(({ onAvatarChange, initialAvatar, children }, ref) => {
	const [avatar, setAvatar] = useState<string | null>(initialAvatar ?? null);
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const editorRef = useRef<ImageEditorRef>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isMobile = useMediaQuery('(max-width: 767px)');

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !file.type.startsWith('image/')) {
			e.target.value = '';
			return;
		}

		const reader = new FileReader();
		reader.onload = event => {
			const dataUrl = event.target?.result as string;
			editorRef.current?.setImage(dataUrl);
			editorRef.current?.open();
			e.target.value = '';
		};
		reader.readAsDataURL(file);
	};

	const handleConfirm = (dataUrl: string) => {
		setAvatar(dataUrl);
		onAvatarChange(dataUrl);
	};

	const handleEditorOpen = () => setIsEditorOpen(true);
	const handleEditorClose = () => setIsEditorOpen(false);

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	useImperativeHandle(
		ref,
		() => ({
			openFilePicker,
			close: () => editorRef.current?.close()
		}),
		[]
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
			<ImageEditor
				ref={editorRef}
				onConfirm={handleConfirm}
				onOpen={handleEditorOpen}
				onClose={handleEditorClose}
			/>
			{isMobile && isEditorOpen && (
				<div className={cls.mobileFooter}>
					<Button
						onClick={() => editorRef.current?.close()}
						color={ButtonColor.PRIMARY}
						theme={ButtonTheme.OUTLINE}
						className={cls.cancelBtn}
					>
						Отменить
					</Button>
					<Button
						className={cls.changeBtn}
						onClick={() => editorRef.current?.confirm()}
						color={ButtonColor.PRIMARY}
					>
						Выбрать фото
					</Button>
				</div>
			)}
		</>
	);
});

AvatarUploader.displayName = 'AvatarUploader';
