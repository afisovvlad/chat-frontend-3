'use client';

import {
	forwardRef,
	memo,
	useCallback,
	useRef,
	useState,
	useImperativeHandle
} from 'react';
import { ImageEditorRef } from '../../model/types/types';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import {
	CustomAvatarEditor,
	CustomAvatarEditorRef
} from '../CustomAvatarEditor/CustomAvatarEditor';
import { EditorHeader } from '../EditorHeader/EditorHeader';
import { EditorControls } from '../EditorController/EditorControls';
import { useScaleControl } from '../../model/lib/hooks/useScaleControl/useScaleControl';
import { useImageEditorConfig } from '../../model/lib/hooks/useImageEditorConfig/useImageEditorConfig';

import { Modal } from '@/shared/ui/Modal';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { Text, TextSize, TextTag, TextType, TitleTag } from '@/shared/ui/Text';
import cls from './ImageEditor.module.scss';
import { validateImageFile } from '../../model/lib/validateImage/validateImage';

export interface ImageEditorProps {
	onClose: () => void;
	onConfirm: (file: File) => void;
	image: string;
}

export const ImageEditorInner = forwardRef<ImageEditorRef, ImageEditorProps>(
	({ onClose, onConfirm, image }, ref) => {
		const isMobile = useMediaQuery();
		const { width, height } = useImageEditorConfig();
		const canvasRef = useRef<CustomAvatarEditorRef>(null); // ✅ Исправлен тип
		const [error, setError] = useState<string | null>(null);
		const scaleControl = useScaleControl(1, 1, 3);
		const { scale, minScale, maxScale, setScale, setMinScale, setMaxScale } =
			scaleControl;
		const isDesktop = !isMobile;

		// ✅ Централизованная обработка ошибок
		const showError = useCallback((message: string) => {
			setError(message);
			const timer = setTimeout(() => setError(null), 3000);
			return () => clearTimeout(timer);
		}, []);

		// ✅ Автоустановка scale на основе изображения
		const handleImageLoad = useCallback(
			(img: HTMLImageElement) => {
				const scaleX = width / img.width;
				const scaleY = height / img.height;
				const coverScale = Math.max(scaleX, scaleY);
				setMinScale(coverScale);
				setMaxScale(Math.min(3, coverScale * 3));
				setScale(coverScale * 1.65);
			},
			[width, height, setMinScale, setMaxScale, setScale]
		);

		// ✅ Оптимизированный export с обработкой ошибок
		const getResultBlob = useCallback(async (): Promise<Blob | null> => {
			const canvas = canvasRef.current?.getImageWithoutMask();
			if (!canvas) {
				showError('Не удалось получить изображение. Попробуйте ещё раз');
				return null;
			}

			return new Promise(resolve => {
				canvas.toBlob(
					blob => {
						if (!blob) {
							showError('Ошибка создания изображения');
							resolve(null);
							return;
						}
						if (blob.size === 0) {
							showError('Созданное изображение пустое');
							resolve(null);
							return;
						}
						resolve(blob);
					},
					'image/jpeg',
					0.92
				);
			});
		}, [showError]);

		// ✅ Упрощённый confirm с обработкой ошибок
		const handleConfirm = useCallback(async () => {
			const blob = await getResultBlob();
			if (!blob) {
				return;
			}

			const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

			// ✅ Централизованная валидация
			const isValid = await validateImageFile(file);
			if (!isValid) {
				showError('Файл повреждён. Попробуйте выбрать другое изображение');
				return;
			}

			onConfirm(file);
		}, [getResultBlob, onConfirm, showError]);

		useImperativeHandle(
			ref,
			() => ({
				confirm: handleConfirm
			}),
			[handleConfirm]
		);

		return (
			<div className={cls.cropScreen}>
				<EditorHeader onClose={onClose} />

				<div className={cls.editorContainer}>
					<div className={cls.editorWrapper}>
						<CustomAvatarEditor
							ref={canvasRef}
							image={image}
							width={width}
							height={height}
							scale={scale}
							rotate={0}
							onLoadSuccess={handleImageLoad}
							disableBoundaryChecks={false}
							disableHiDPIScaling={false}
							color={[0, 0, 0, 0.1]}
						/>
					</div>
				</div>

				<EditorControls
					scale={scale}
					minScale={minScale}
					maxScale={maxScale}
					onScaleChange={setScale}
					onConfirm={handleConfirm}
					isDesktop={isDesktop}
				/>

				{/* ✅ Модальное окно ошибки */}
				{error && (
					<Modal
						isOpen={!!error}
						onClose={() => setError(null)}
						size='wide'
						borderRadius='8px'
					>
						<div className={cls.errorModalContent}>
							<Text
								type={TextType.TITLE}
								tag={TitleTag.H3}
								fontSize={TextSize.L}
							>
								Ошибка обработки
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
			</div>
		);
	}
);

ImageEditorInner.displayName = 'ImageEditorInner';
export const ImageEditor = memo(ImageEditorInner);
