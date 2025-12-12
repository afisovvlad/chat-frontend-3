'use client';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Close } from '@icons/index';

import cls from './Modal.module.scss';

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	closeButton?: ReactNode;
	className?: string;
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
	className
}: ModalProps) => {
	useEffect(() => {
		if (!isOpen) {
			return;
		}
		document.body.style.overflow = 'hidden';

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen) {
		return null;
	}

	return createPortal(
		<div className={cls.overlay} onClick={handleOverlayClick}>
			<div className={classNames(cls.modal, {}, [className])}>
				{closeButton && (
					<button className={cls.closeButton} onClick={onClose}>
						<Close className={cls.closeIcon} />
					</button>
				)}

				<div className={cls.content}>{children}</div>
			</div>
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
