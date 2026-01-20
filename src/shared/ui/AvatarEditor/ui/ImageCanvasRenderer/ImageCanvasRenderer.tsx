// ImageCanvasRenderer.tsx
import { memo } from 'react';
import { CustomAvatarEditor } from '../CustomAvatarEditor/CustomAvatarEditor';

interface ImageCanvasRendererProps {
	image: string;
	width: number;
	height: number;
	scale: number;
	onLoadSuccess: (img: HTMLImageElement) => void;
}

const ImageCanvasRenderer = memo(
	({
		image,
		width,
		height,
		scale,
		onLoadSuccess
	}: ImageCanvasRendererProps) => {
		return (
			<CustomAvatarEditor
				image={image}
				width={width}
				height={height}
				scale={scale}
				rotate={0}
				onLoadSuccess={onLoadSuccess}
				disableBoundaryChecks={false}
				disableHiDPIScaling={false}
				color={[0, 0, 0, 0.1]}
			/>
		);
	},
	(prev, next) => {
		// Перерисовывать ТОЛЬКО если изменились image, scale, width, height ИЛИ onLoadSuccess
		return (
			prev.image === next.image &&
			prev.scale === next.scale &&
			prev.width === next.width &&
			prev.height === next.height &&
			prev.onLoadSuccess === next.onLoadSuccess
		);
	}
);

ImageCanvasRenderer.displayName = 'ImageCanvasRenderer';

export { ImageCanvasRenderer };
