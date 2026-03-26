'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { Smile } from '@icons/index';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import cls from './EmojiPickerComponent.module.scss';

const Picker = dynamic(() => import('emoji-picker-react'), {
	ssr: false
});

interface EmojiPickerComponentProps {
	parentClass?: string;
	onEmojiSelect: (emoji: string) => void;
	disabled?: boolean;
}

export function EmojiPickerComponent({
	parentClass,
	onEmojiSelect,
	disabled
}: EmojiPickerComponentProps) {
	const [showPicker, setShowPicker] = useState(false);

	const togglePicker = useCallback(() => {
		setShowPicker(prev => !prev);
	}, []);

	const handleEmojiClick = useCallback(
		(emojiData: { emoji: string }) => {
			onEmojiSelect(emojiData.emoji);
			setShowPicker(false);
		},
		[onEmojiSelect]
	);

	return (
		<div style={{ position: 'relative' }}>
			<Button
				color={ButtonColor.TRANSPARENT}
				className={classNames(cls.button, {}, [parentClass])}
				aria-label='Выбрать эмодзи'
				aria-expanded={showPicker}
				disabled={disabled}
				onClick={togglePicker}
			>
				<Smile width={20} height={20} />
			</Button>

			{showPicker && (
				<Picker
					width={350}
					height={450}
					onEmojiClick={handleEmojiClick}
					className={cls.picker}
				/>
			)}
		</div>
	);
}
