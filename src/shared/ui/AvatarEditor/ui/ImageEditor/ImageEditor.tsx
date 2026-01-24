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
	onConfirm: (dataUrl: string) => void;
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
				setScale(coverScale * 1.51);
			},
			[setMinScale, setMaxScale, setScale]
		);
		useEffect(() => {
			widthRef.current = width;
			heightRef.current = height;
		}, [width, height]);

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
			[]
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
