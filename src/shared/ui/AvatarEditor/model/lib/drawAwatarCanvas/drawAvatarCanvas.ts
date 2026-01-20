export interface DrawAvatarCanvasOptions {
	ctx: CanvasRenderingContext2D;
	img: HTMLImageElement;
	width: number;
	height: number;
	scale: number;
	rotate: number;
	position: { x: number; y: number };
	color: [number, number, number, number];
	disableHiDPIScaling: boolean;
}

export function drawAvatarCanvas({
	ctx,
	img,
	width,
	height,
	scale,
	rotate,
	position,
	color,
	disableHiDPIScaling
}: DrawAvatarCanvasOptions) {
	const dpr = disableHiDPIScaling
		? 1
		: typeof window !== 'undefined'
			? window.devicePixelRatio || 1
			: 1;

	ctx.canvas.width = width * dpr;
	ctx.canvas.height = height * dpr;

	if (!disableHiDPIScaling && typeof window !== 'undefined') {
		ctx.scale(dpr, dpr);
	}

	ctx.clearRect(0, 0, width, height);

	const centerX = width / 2;
	const centerY = height / 2;
	const radius = Math.min(width, height) / 2;

	// 1. Фоновое изображение
	if (rotate !== 0) {
		ctx.save();
		ctx.translate(centerX, centerY);
		ctx.rotate((rotate * Math.PI) / 180);
		ctx.translate(-centerX, -centerY);
	}

	const imgW = img.width * scale;
	const imgH = img.height * scale;
	const dx = (width - imgW) / 2 + position.x;
	const dy = (height - imgH) / 2 + position.y;
	ctx.drawImage(img, dx, dy, imgW, imgH);

	if (rotate !== 0) {
		ctx.restore();
	}

	// 2. Затемнение
	ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
	ctx.fillRect(0, 0, width, height);

	// 3. Белый круг
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
	ctx.fill();

	// 4. Обрезанное изображение
	ctx.save();
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
	ctx.clip();

	if (rotate !== 0) {
		ctx.translate(centerX, centerY);
		ctx.rotate((rotate * Math.PI) / 180);
		ctx.translate(-centerX, -centerY);
	}

	ctx.drawImage(img, dx, dy, imgW, imgH);
	ctx.restore();
}
