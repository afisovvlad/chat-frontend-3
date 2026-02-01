import {
	forwardRef,
	useImperativeHandle,
	useCallback,
	useRef,
	memo,
	useEffect
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
import cls from './ImageEditor.module.scss';

export interface ImageEditorProps {
	onClose: () => void;
	onConfirm: (file: File) => void;
	image: string;
}

export const ImageEditorInner = forwardRef<ImageEditorRef, ImageEditorProps>(
	({ onClose, onConfirm, image }, ref) => {
		const isMobile = useMediaQuery();
		const { width, height } = useImageEditorConfig();
		const isDesktop = !isMobile;
		const canvasRef = useRef<CustomAvatarEditorRef>(null);
		const widthRef = useRef(width);
		const heightRef = useRef(height);

		const scaleControl = useScaleControl(1, 1, 3);
		const { scale, minScale, maxScale, setScale, setMinScale, setMaxScale } =
			scaleControl;

		useEffect(() => {
			widthRef.current = width;
			heightRef.current = height;
		}, [width, height]);

		const handleImageLoad = useCallback(
			(img: HTMLImageElement) => {
				const scaleX = widthRef.current / img.width;
				const scaleY = heightRef.current / img.height;
				const coverScale = Math.max(scaleX, scaleY);
				setMinScale(coverScale);
				setMaxScale(Math.min(3, coverScale * 3));
				setScale(coverScale * 1.65);
			},
			[setMinScale, setMaxScale, setScale]
		);

		// Валидация изображения
		const validateImageFile = async (file: File): Promise<boolean> => {
			return new Promise(resolve => {
				const img = new Image();
				img.onload = () => {
					resolve(true);
				};
				img.onerror = () => {
					resolve(false);
				};
				img.src = URL.createObjectURL(file);
			});
		};

		const getResult = useCallback((): Promise<Blob | null> => {
			return new Promise(resolve => {
				const canvas = canvasRef.current?.getImageWithoutMask(); //
				if (!canvas) {
					console.error('❌ Канвас не найден');
					resolve(null);
					return;
				}

				const ctx = canvas.getContext('2d');
				if (!ctx) {
					console.error('❌ Не удалось получить контекст канваса');
					resolve(null);
					return;
				}

				// Проверяем, что канвас не пустой
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const data = imageData.data;
				let isBlank = true;

				for (let i = 0; i < data.length; i += 4) {
					if (
						data[i] !== 0 ||
						data[i + 1] !== 0 ||
						data[i + 2] !== 0 ||
						data[i + 3] !== 0
					) {
						isBlank = false;
						break;
					}
				}

				if (isBlank) {
					console.error('❌ Канвас пустой, невозможно создать изображение');
					resolve(null);
					return;
				}

				canvas.toBlob(
					blob => {
						if (!blob) {
							console.error('❌ Не удалось создать Blob из канваса');
							resolve(null);
							return;
						}

						if (blob.size === 0) {
							console.error('❌ Созданный Blob пустой');
							resolve(null);
							return;
						}

						resolve(blob);
					},
					'image/jpeg', // Явно указываем тип
					0.92 // Качество 92%
				);
			});
		}, []);

		const handleConfirm = useCallback(async () => {
			const blob = await getResult();
			if (!blob) {
				console.error('❌ Не удалось получить изображение');
				// Можно показать ошибку пользователю
				// onClose();
				return;
			}

			// Создаем файл с правильным типом
			const file = new File([blob], 'avatar.jpg', {
				type: 'image/jpeg',
				lastModified: Date.now()
			});

			// Валидация файла
			const isValid = await validateImageFile(file);
			if (!isValid) {
				console.error('❌ Созданный файл не является валидным изображением');
				// Можно показать ошибку пользователю
				// onClose();
				return;
			}

			onConfirm(file);
		}, [getResult, onConfirm]);

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
			</div>
		);
	}
);

ImageEditorInner.displayName = 'ImageEditor';

export const ImageEditor = memo(ImageEditorInner);
