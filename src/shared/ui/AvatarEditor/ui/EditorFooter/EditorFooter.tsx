import { memo } from 'react';
import { Button, ButtonColor, ButtonTheme } from '@/shared/ui/Button';
import cls from './editorFooter.module.scss';

interface EditorFooterProps {
	onCancel: () => void;
	onConfirm: () => void;
}

export const EditorFooter = memo(
	({ onCancel, onConfirm }: EditorFooterProps) => {
		return (
			<div className={cls.mobileFooter}>
				<Button
					onClick={onCancel}
					color={ButtonColor.PRIMARY}
					theme={ButtonTheme.OUTLINE}
					className={cls.cancelBtn}
				>
					Отменить
				</Button>
				<Button
					onClick={onConfirm}
					color={ButtonColor.PRIMARY}
					className={cls.changeBtn}
				>
					Выбрать фото
				</Button>
			</div>
		);
	}
);

EditorFooter.displayName = 'EditorFooter';
