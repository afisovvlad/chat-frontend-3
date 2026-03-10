'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutside/useClickOutside';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { Smile } from '@icons/index';
import { EmojiStyle, Theme } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './EmojiPickerComponent.module.scss';

const Picker = dynamic(
	() => import('emoji-picker-react').then(mod => mod.default),
	{ ssr: false }
);

interface EmojiPickerComponentProps {
	parentClass?: string;
	onEmojiSelect: (emoji: string) => void;
}

export function EmojiPickerComponent({
	parentClass,
	onEmojiSelect
}: EmojiPickerComponentProps) {
	const [showPicker, setShowPicker] = useState(false);
	const pickerRef = useRef<HTMLDivElement>(null);

	// закрытие picker
	const closePicker = useCallback(() => {
		setShowPicker(false);
	}, []);

	// toggle кнопки
	const togglePicker = useCallback(() => {
		setShowPicker(prev => !prev);
	}, []);

	// клик вне компонента
	useClickOutside(pickerRef, closePicker);

	// закрытие при scroll
	useEffect(() => {
		if (!showPicker) {
			return;
		}

		window.addEventListener('scroll', closePicker, { passive: true });

		return () => {
			window.removeEventListener('scroll', closePicker);
		};
	}, [showPicker, closePicker]);

	return (
		<div className={styles.emojiContainer} ref={pickerRef}>
			<Button
				color={ButtonColor.TRANSPARENT}
				className={classNames(
					styles.button,
					{ [styles.iconActive]: showPicker },
					[parentClass]
				)}
				aria-label={
					showPicker ? 'Закрыть выбор эмодзи' : 'Открыть выбор эмодзи'
				}
				onClick={togglePicker}
			>
				<Smile className={styles.smileIcon} />
			</Button>

			{showPicker && (
				<Picker
					emojiStyle={EmojiStyle.APPLE}
					theme={Theme.LIGHT}
					lazyLoadEmojis
					skinTonesDisabled
					previewConfig={{ showPreview: false }}
					onEmojiClick={emojiData => {
						onEmojiSelect(emojiData.emoji);
					}}
					className={styles.picker}
				/>
			)}
		</div>
	);
}
