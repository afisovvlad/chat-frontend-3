import {
	forwardRef,
	useImperativeHandle,
	useCallback,
	useRef,
	memo
} from 'react';

import { ImageEditorRef } from '../../model/types/types';
import { useImageEditorConfig } from '../../model/config/ImageEditorConfig';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { CustomAvatarEditorRef } from '../CustomAvatarEditor/CustomAvatarEditor';
import { ImageCanvasRenderer } from '../ImageCanvasRenderer/ImageCanvasRenderer';
import { EditorHeader } from '../EditorHeader/EditorHeader';
import { EditorControls } from '../EditorController/EditorControls';
import { useScaleControl } from '../../model/lib/useScaleControl/useScaleControl';
import cls from './imageEditor.module.scss';

export interface ImageEditorProps {
	onClose: () => void;
	onConfirm: (dataUrl: string) => void;
	image: string;
}

export const ImageEditorInner = forwardRef<ImageEditorRef, ImageEditorProps>(
	({ onClose, onConfirm, image }, ref) => {
		const isMobile = useMediaQuery();
		const { width, height } = useImageEditorConfig();
		const isDesktop = !isMobile;
		const canvasRef = useRef<CustomAvatarEditorRef>(null);

		const scaleControl = useScaleControl(1, 1, 3);
		const { scale, minScale, maxScale, setScale, setMinScale, setMaxScale } =
			scaleControl;

		const handleImageLoad = useCallback(
			(img: HTMLImageElement) => {
				const scaleX = width / img.width;
				const scaleY = height / img.height;
				const coverScale = Math.max(scaleX, scaleY);
				setMinScale(coverScale);
				setMaxScale(Math.min(3, coverScale * 3));
				setScale(coverScale * 1.51);
			},
			[width, height, setMinScale, setMaxScale, setScale]
		);

		const getResult = useCallback((): Promise<string | null> => {
			return new Promise(resolve => {
				const canvas = canvasRef.current?.getImageScaledToCanvas();
				if (!canvas) {
					resolve(null);
					return;
				}
				resolve(canvas.toDataURL('image/jpeg', 0.85));
			});
		}, []);

		const handleConfirm = useCallback(async () => {
			const dataUrl = await getResult();
			if (dataUrl !== null) {
				onConfirm(dataUrl);
			}
			onClose();
		}, [getResult, onConfirm, onClose]);

		useImperativeHandle(
			ref,
			() => ({
				getResult,
				confirm: handleConfirm
			}),
			[getResult, handleConfirm]
		);

		return (
			<div className={cls.cropScreen}>
				<EditorHeader onClose={onClose} />
				<div className={cls.editorContainer}>
					<div className={cls.editorWrapper}>
						<ImageCanvasRenderer
							image={image}
							width={width}
							height={height}
							scale={scale}
							onLoadSuccess={handleImageLoad}
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
