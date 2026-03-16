import { memo } from 'react';
import { Close } from '@icons/index';
import { Text, TextColor, TextTag, TextType } from '@/shared/ui/Text';
import {
	Button,
	ButtonColor,
	ButtonSize,
	ButtonTheme
} from '@/shared/ui/Button';
import cls from './EditorHeader.module.scss';

interface EditorHeaderProps {
	onClose: () => void;
}

export const EditorHeader = memo(({ onClose }: EditorHeaderProps) => {
	return (
		<div className={cls.header}>
			<Text
				color={TextColor.BLACK}
				type={TextType.TEXT}
				tag={TextTag.SPAN}
				className={cls.headerTitle}
			>
				Настроить отображение фото
			</Text>
			<Button
				theme={ButtonTheme.CLEAR}
				color={ButtonColor.TRANSPARENT}
				size={ButtonSize.S}
				className={cls.closeButton}
				onClick={onClose}
				aria-label='Закрыть редактор аватара'
			>
				<Close className={cls.closeIcon} aria-hidden='true' />
			</Button>
		</div>
	);
});

EditorHeader.displayName = 'EditorHeader';
