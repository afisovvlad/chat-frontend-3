import { memo, useState, useEffect } from 'react';
import { Checked } from '@icons/index';
import { Button, ButtonTheme, ButtonType } from '@/shared/ui/Button';
import cls from './EditorControls.module.scss';

interface EditorControlsProps {
	scale: number;
	minScale: number;
	maxScale: number;
	onScaleChange: (value: number) => void;
	onConfirm: () => void;
	isDesktop: boolean;
}

export const EditorControls = memo(
	({
		scale,
		minScale,
		maxScale,
		onScaleChange,
		onConfirm,
		isDesktop
	}: EditorControlsProps) => {
		// Состояние для отслеживания клика
		const [showCheckmark, setShowCheckmark] = useState(false);

		// Обработчик клика
		const handleClick = () => {
			// Показываем иконку
			setShowCheckmark(true);
			// Вызываем колбэк подтверждения
			onConfirm();
		};

		useEffect(() => {
			if (showCheckmark) {
				const timer = setTimeout(() => {
					setShowCheckmark(false);
				}, 1000);

				return () => clearTimeout(timer);
			}
		}, [showCheckmark]);

		return (
			<div className={cls.controlRow}>
				<div className={cls.zoomControl}>
					<input
						type='range'
						min={minScale}
						max={maxScale}
						step='0.01'
						value={scale}
						onChange={e => onScaleChange(parseFloat(e.target.value))}
						className={cls.zoomSlider}
						aria-label='Масштаб изображения'
					/>
				</div>

				{isDesktop && (
					<Button
						btnType={ButtonType.BUTTON}
						theme={ButtonTheme.CIRCLE}
						className={`${cls.checkmark} ${showCheckmark ? cls.checkmarkActive : ''}`}
						onClick={handleClick}
						aria-label='Подтвердить выбор аватара'
					>
						{showCheckmark ? (
							<Checked className={cls.checkIcon} />
						) : (
							<div className={cls.checkboxEmpty} />
						)}
					</Button>
				)}
			</div>
		);
	}
);
EditorControls.displayName = 'EditorControls';
