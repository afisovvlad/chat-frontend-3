'use client';

import React from 'react';
import {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef
} from 'react';
import { drawAvatarCanvas } from '../../model/lib/drawAwatarCanvas/drawAvatarCanvas';

export interface CustomAvatarEditorProps {
	image: string | HTMLImageElement | HTMLVideoElement;
	width: number;
	height: number;
	scale: number;
	rotate?: number;
	onLoadSuccess?: (img: HTMLImageElement) => void;
	disableBoundaryChecks?: boolean;
	disableHiDPIScaling?: boolean;
	color?: [number, number, number, number];
}

export interface CustomAvatarEditorRef {
	getImageScaledToCanvas(): HTMLCanvasElement | null;
	getImageWithoutMask(): HTMLCanvasElement | null;
}

const CustomAvatarEditorComponent = forwardRef<
	CustomAvatarEditorRef,
	CustomAvatarEditorProps
>(
	(
		{
			image,
			width,
			height,
			scale,
			rotate = 0,
			onLoadSuccess,
			disableBoundaryChecks = false,
			disableHiDPIScaling = false,
			color = [0, 0, 0, 0.2]
		},
		ref
	) => {
		const canvasRef = useRef<HTMLCanvasElement>(null);
		const imgRef = useRef<HTMLImageElement | null>(null);
		const positionRef = useRef({ x: 0, y: 0 });
		const loadRef = useRef(false);
		const currentWidthRef = useRef(width);
		const currentHeightRef = useRef(height);
		const currentScaleRef = useRef(scale);
		const propsRef = useRef({ width, height, scale });

		useEffect(() => {
			currentWidthRef.current = width;
			currentHeightRef.current = height;
			currentScaleRef.current = scale;
		}, [width, height, scale]);

		useEffect(() => {
			propsRef.current = { width, height, scale };
		}, [width, height, scale]);

		const redraw = useCallback(() => {
			const canvas = canvasRef.current;
			const img = imgRef.current;
			if (!canvas || !img) {
				return;
			}
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				return;
			}

			// Очищаем канвас перед отрисовкой
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			drawAvatarCanvas({
				ctx,
				img,
				width,
				height,
				scale,
				rotate,
				position: positionRef.current,
				color,
				disableHiDPIScaling
			});
		}, [width, height, scale, rotate, color, disableHiDPIScaling]);

		useEffect(() => {
			loadRef.current = false;
		}, [image]);

		//  Автокоррекция позиции при изменении scale
		useEffect(() => {
			if (!imgRef.current) {
				return;
			}

			const imgW = imgRef.current.width * scale;
			const imgH = imgRef.current.height * scale;

			// Корректные границы: 0, если изображение не выходит за пределы
			const maxX = imgW > width ? (imgW - width) / 2 : 0;
			const maxY = imgH > height ? (imgH - height) / 2 : 0;

			const newX = disableBoundaryChecks
				? positionRef.current.x
				: Math.max(-maxX, Math.min(maxX, positionRef.current.x));
			const newY = disableBoundaryChecks
				? positionRef.current.y
				: Math.max(-maxY, Math.min(maxY, positionRef.current.y));

			// Но если изображение меньше — игнорируем смещение (центрируем)
			const finalX = imgW <= width ? 0 : newX;
			const finalY = imgH <= height ? 0 : newY;

			positionRef.current = { x: finalX, y: finalY };
			redraw();
		}, [scale, width, height, redraw, disableBoundaryChecks]);

		//  Загрузка изображения
		useEffect(() => {
			if (loadRef.current) {
				return;
			}
			let img: HTMLImageElement;

			if (typeof image === 'string') {
				img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = () => {
					loadRef.current = true;
					imgRef.current = img;
					positionRef.current = { x: 0, y: 0 };
					onLoadSuccess?.(img);
					redraw();
				};
				img.src = image;
			} else if (
				image instanceof HTMLImageElement ||
				image instanceof HTMLVideoElement
			) {
				loadRef.current = true;
				imgRef.current = image as HTMLImageElement;
				positionRef.current = { x: 0, y: 0 };
				onLoadSuccess?.(image as HTMLImageElement);
				redraw();
			}
		}, [image, onLoadSuccess, redraw]);

		// Drag
		const handleDragStart = useCallback(
			(e: React.MouseEvent | React.TouchEvent) => {
				const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
				const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
				const startPos = { ...positionRef.current };

				const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
					const clientX =
						'touches' in moveEvent
							? moveEvent.touches[0]?.clientX
							: moveEvent.clientX;
					const clientY =
						'touches' in moveEvent
							? moveEvent.touches[0]?.clientY
							: moveEvent.clientY;

					if (clientX === null || clientY === null || !imgRef.current) {
						return;
					}
					const { width: w, height: h, scale: s } = propsRef.current;
					const dx = clientX - startX;
					const dy = clientY - startY;
					const imgW = imgRef.current.width * s;
					const imgH = imgRef.current.height * s;
					const maxX = (imgW - w) / 2;
					const maxY = (imgH - h) / 2;

					const clampedMaxX = imgW > currentWidthRef.current ? maxX : 0;
					const clampedMaxY = imgH > currentHeightRef.current ? maxY : 0;

					const newX = disableBoundaryChecks
						? startPos.x + dx
						: Math.max(-clampedMaxX, Math.min(clampedMaxX, startPos.x + dx));
					const newY = disableBoundaryChecks
						? startPos.y + dy
						: Math.max(-clampedMaxY, Math.min(clampedMaxY, startPos.y + dy));

					positionRef.current = { x: newX, y: newY };
					redraw();
				};

				const cleanup = () => {
					document.removeEventListener('mousemove', handleMove);
					document.removeEventListener('touchmove', handleMove);
					document.removeEventListener('mouseup', cleanup);
					document.removeEventListener('touchend', cleanup);
				};

				document.addEventListener('mousemove', handleMove);
				document.addEventListener('touchmove', handleMove);
				document.addEventListener('mouseup', cleanup);
				document.addEventListener('touchend', cleanup);
			},
			[disableBoundaryChecks, redraw]
		);

		useImperativeHandle(ref, () => {
			return {
				getImageScaledToCanvas: () => canvasRef.current,
				getImageWithoutMask: () => {
					if (!imgRef.current) {
						return null;
					}

					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');
					if (!ctx) {
						return null;
					}

					const { width, height, scale } = propsRef.current;
					const { x, y } = positionRef.current;
					const dpr =
						typeof window !== 'undefined' && !disableHiDPIScaling
							? window.devicePixelRatio || 1
							: 1;

					canvas.width = width * dpr;
					canvas.height = height * dpr;

					const imgW = imgRef.current.width * scale;
					const imgH = imgRef.current.height * scale;
					const drawX = (width - imgW) / 2 + x;
					const drawY = (height - imgH) / 2 + y;

					// Рисуем только изображение, без маски и круга
					ctx.drawImage(
						imgRef.current,
						drawX * dpr,
						drawY * dpr,
						imgW * dpr,
						imgH * dpr
					);

					return canvas;
				}
			};
		}, [disableHiDPIScaling]);

		const dpr =
			typeof window !== 'undefined' && !disableHiDPIScaling
				? window.devicePixelRatio || 1
				: 1;
		const canvasWidth = width * dpr;
		const canvasHeight = height * dpr;

		return (
			<div
				style={{
					width: `${width}px`,
					height: `${height}px`,
					touchAction: 'none'
				}}
				onMouseDown={handleDragStart}
				onTouchStart={handleDragStart}
			>
				<canvas
					ref={canvasRef}
					width={canvasWidth}
					height={canvasHeight}
					style={{
						width: `${width}px`,
						height: `${height}px`,
						touchAction: 'none',
						background: 'transparent'
					}}
				/>
			</div>
		);
	}
);

CustomAvatarEditorComponent.displayName = 'CustomAvatarEditor';

export const CustomAvatarEditor = memo(CustomAvatarEditorComponent);
