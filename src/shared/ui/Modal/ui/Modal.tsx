'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Close } from '@icons/index';
import { MODAL_SIZES, ModalSize } from '../model/type';
import { FocusTrap } from 'focus-trap-react';
import {
	Button,
	ButtonColor,
	ButtonSize,
	ButtonTheme
} from '@/shared/ui/Button';
import cls from './Modal.module.scss';

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	closeButton?: boolean;
	className?: string;
	size?: ModalSize;
}

interface ModalActionsProps {
	children: ReactNode;
	className?: string;
}

export const Modal = ({
	isOpen,
	onClose,
	children,
	closeButton,
	className,
	size
}: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);

	// Управление body.overflow через класс
	useEffect(() => {
		if (isOpen) {
			document.body.classList.add('modal-open');
		} else {
			document.body.classList.remove('modal-open');
		}

		// Cleanup при размонтировании компонента
		return () => {
			document.body.classList.remove('modal-open');
		};
	}, [isOpen]);

	// Escape-закрытие
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen) {
		return null;
	}

	const renderCloseButton = () => {
		if (closeButton) {
			return (
				<Button
					theme={ButtonTheme.CLEAR}
					color={ButtonColor.TRANSPARENT}
					size={ButtonSize.S}
					className={cls.closeButton}
					onClick={onClose}
					aria-label='Закрыть'
				>
					<Close className={cls.closeIcon} aria-hidden='true' />
				</Button>
			);
		}
		return null;
	};

	return createPortal(
		<div
			className={cls.overlay}
			onClick={handleOverlayClick}
			role='dialog'
			aria-modal='true'
		>
			<FocusTrap
				active={isOpen}
				focusTrapOptions={{
					allowOutsideClick: true,
					fallbackFocus: () => modalRef.current!
				}}
			>
				<div
					ref={modalRef}
					tabIndex={-1}
					className={classNames(cls.modal, {}, [className])}
					style={{ maxWidth: size ? MODAL_SIZES[size] : undefined }}
				>
					{renderCloseButton()}
					<div className={cls.content}>{children}</div>
				</div>
			</FocusTrap>
		</div>,
		document.body
	);
};

const ModalActions = ({ children, className }: ModalActionsProps) => {
	return (
		<div className={classNames(cls.actions, {}, [className])}>{children}</div>
	);
};

Modal.Actions = ModalActions;
