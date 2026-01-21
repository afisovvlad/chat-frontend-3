'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Close } from '@icons/index';
import {
	MODAL_BORDER_RADIUS,
	MODAL_SIZES,
	ModalBorderRadius,
	ModalSize
} from '../model/type';
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
	overlayMode?: 'full' | 'container';
	containerRef?: React.RefObject<Element | null>;
	borderRadius?: ModalBorderRadius;
	overlayClassName?: string;
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
	overlayMode = 'full',
	containerRef,
	borderRadius,
	overlayClassName
}: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) {
			return;
		}
		if (isOpen && overlayMode === 'full') {
			document.body.classList.add('modal-open');
		} else if (!isOpen && overlayMode === 'full') {
			document.body.classList.remove('modal-open');
		}

		return () => {
			if (overlayMode === 'full') {
				document.body.classList.remove('modal-open');
			}
		};
	}, [isOpen, mounted, overlayMode]);

	// Escape-закрытие
	useEffect(() => {
		if (!mounted) {
			return;
		}
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, mounted, onClose]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen || !isOpen) {
		return null;
	}
	const portalContainer =
		overlayMode === 'container' && containerRef?.current
			? containerRef.current
			: document.body;

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
			className={classNames(
				cls.overlay,
				{
					[cls['overlay--container']]: overlayMode === 'container'
				},
				[overlayClassName]
			)}
			style={
				overlayMode === 'container' && borderRadius
					? { borderRadius }
					: undefined
			}
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
					style={{
						maxWidth: size ? MODAL_SIZES[size] : undefined,
						borderRadius: borderRadius
							? MODAL_BORDER_RADIUS[borderRadius]
							: undefined
					}}
				>
					{renderCloseButton()}
					<div className={cls.content}>{children}</div>
				</div>
			</FocusTrap>
		</div>,
		portalContainer
	);
};

const ModalActions = ({ children, className }: ModalActionsProps) => {
	return (
		<div className={classNames(cls.actions, {}, [className])}>{children}</div>
	);
};

Modal.Actions = ModalActions;
