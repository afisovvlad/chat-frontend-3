'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { Smile } from '@icons/index';
import Picker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import styles from './EmojiPickerComponent.module.scss';

// const Picker = dynamic(() => import('emoji-picker-react'), {
// 	ssr: false
// });

interface EmojiPickerComponent {
	parentClass?: string;
	onEmojiSelect: (emoji: string) => void;
}

export function EmojiPickerComponent({
	parentClass,
	onEmojiSelect
}: EmojiPickerComponent) {
	const [showPicker, setShowPicker] = useState(false);
	const pickerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target as Node)
			) {
				setShowPicker(false);
			}
		}

		if (showPicker) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showPicker]);

	return (
		<div className={styles.emojiContainer} ref={pickerRef}>
			<Button
				color={ButtonColor.TRANSPARENT}
				className={classNames(styles.button, {}, [parentClass])}
				aria-label='Прикрепить файл'
				onClick={() => setShowPicker(!showPicker)}
			>
				<Smile />
			</Button>

			{showPicker && (
				<Picker
					emojiStyle={EmojiStyle.APPLE}
					theme={Theme.LIGHT}
					lazyLoadEmojis
					skinTonesDisabled
					previewConfig={{ showPreview: false }}
					width={350}
					height={420}
					onEmojiClick={emojiData => {
						onEmojiSelect(emojiData.emoji);
						setShowPicker(false);
					}}
					className={styles.picker}
				/>
			)}
		</div>
	);
}
