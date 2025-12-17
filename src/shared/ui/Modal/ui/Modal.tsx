'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Close } from '@icons/index';
import { MODAL_SIZES_PX, ModalSize } from '../model/type';
import { FocusTrap } from 'focus-trap-react';
import cls from './Modal.module.scss';

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	closeButton?: ReactNode | boolean;
	className?: string;
	size?: ModalSize;
	unmountOnClose?: boolean;
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
	size,
	unmountOnClose = true
}: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);

	const originalOverflow = useRef<string>('');

	useEffect(() => {
		if (!isOpen) {
			if (originalOverflow.current !== '') {
				document.body.style.overflow = originalOverflow.current;
				originalOverflow.current = '';
			}
			return;
		}

		originalOverflow.current = document.body.style.overflow || '';
		document.body.style.overflow = 'hidden';

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			if (originalOverflow.current !== '') {
				document.body.style.overflow = originalOverflow.current;
				originalOverflow.current = '';
			}
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen && unmountOnClose) {
		return null;
	}

	const renderCloseButton = () => {
		if (closeButton === true) {
			return (
				<button
					className={cls.closeButton}
					onClick={onClose}
					aria-label='Закрыть'
				>
					<Close className={cls.closeIcon} aria-hidden='true' />
				</button>
			);
		}
		return closeButton && typeof closeButton === 'object' ? closeButton : null;
	};

	const sizeClass = cls[`size_${size}`];

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
					className={classNames(cls.modal, {}, [className, sizeClass])}
					style={{ maxWidth: size ? MODAL_SIZES_PX[size] : undefined }}
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
