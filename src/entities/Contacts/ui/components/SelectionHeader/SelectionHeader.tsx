import { memo } from 'react';
import { Text, TextSize, TextTag, TextType, TextColor } from '@/shared/ui/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { Trash, CancelSelection, Left } from '@icons/index';
import cls from './SelectionHeader.module.scss';

export interface SelectionHeaderProps {
	selectedCount: number;
	onBack: () => void;
	onReset: () => void;
	onDelete: () => void;
}

export const SelectionHeader = memo(
	({ selectedCount, onBack, onReset, onDelete }: SelectionHeaderProps) => {
		return (
			<div className={cls.selectionHeader}>
				<div className={cls.btnWrapper}>
					<div className={cls.btnContainer}>
						<Button
							theme={ButtonTheme.CLEAR}
							className={cls.backButton}
							onClick={onBack}
							aria-label='Вернуться назад'
						>
							<Left className={cls.backIcon} aria-hidden='true' />
						</Button>

						<Button
							onClick={onDelete}
							theme={ButtonTheme.CLEAR}
							className={cls.delBtn}
						>
							<Text
								type={TextType.TEXT}
								tag={TextTag.P}
								fontSize={TextSize.M}
								color={TextColor.BLACK}
								truncate
							>
								Удалить контакты
							</Text>
						</Button>
					</div>

					<div className={cls.rightButtons}>
						{selectedCount === 0 && (
							<Button
								theme={ButtonTheme.CLEAR}
								className={cls.trashDisabledBtn}
								disabled={true}
							>
								<Trash className={cls.trashIcon} aria-hidden='true' />
							</Button>
						)}

						{selectedCount > 0 && (
							<Button
								theme={ButtonTheme.CLEAR}
								className={cls.cancelButton}
								onClick={onReset}
								aria-label='Отменить выбор'
							>
								<CancelSelection
									className={cls.cancelIcon}
									aria-hidden='true'
								/>
							</Button>
						)}
					</div>
				</div>
			</div>
		);
	}
);

SelectionHeader.displayName = 'SelectionHeader';
