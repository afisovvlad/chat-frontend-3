import {
	forwardRef,
	useImperativeHandle,
	useState,
	useCallback,
	useRef,
	useEffect
} from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Close, Checked } from '@icons/index';
import { createPortal } from 'react-dom';
import { Text, TextColor, TextTag, TextType } from '@/shared/ui/Text';
import {
	Button,
	ButtonColor,
	ButtonSize,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { ImageEditorRef, ImageEditorProps } from '../model/config/types';
import { useImageEditorConfig } from '../model/config/ImageEditorConfig';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { FocusTrap } from 'focus-trap-react';
import cls from './ImageEditor.module.scss';

export const ImageEditor = forwardRef<ImageEditorRef, ImageEditorProps>(
	({ onOpen, onClose, onConfirm }, ref) => {
		const config = useImageEditorConfig();
		const isDesktop = useMediaQuery('(min-width: 768px)');

		const [isModalOpen, setIsModalOpen] = useState(false);
		const [selectedImage, setSelectedImage] = useState<string | null>(null);
		const [scale, setScale] = useState(1);
		const [minScale, setMinScale] = useState(1);
		const editorRef = useRef<AvatarEditor>(null);
		const modalRef = useRef<HTMLDivElement>(null);

		const openModal = useCallback(() => {
			setIsModalOpen(true);
			onOpen?.();
		}, [onOpen]);

		const closeModal = useCallback(() => {
			setIsModalOpen(false);
			setSelectedImage(null);
			onClose?.();
		}, [onClose]);

		const setImage = useCallback((url: string) => {
			setSelectedImage(url);
		}, []);

		const handleImageLoad = useCallback(
			(img: HTMLImageElement) => {
				const scaleX = config.width / img.width;
				const scaleY = config.height / img.height;
				const min = Math.max(scaleX, scaleY);
				setMinScale(min);
				setScale(min);
			},
			[config]
		);

		const getResult = useCallback((): Promise<string | null> => {
			return new Promise(resolve => {
				if (!editorRef.current) {
					resolve(null);
					return;
				}
				const canvas = editorRef.current.getImageScaledToCanvas();
				resolve(canvas.toDataURL('image/jpeg', 0.85));
			});
		}, []);

		const handleConfirm = useCallback(async () => {
			const dataUrl = await getResult();
			if (dataUrl !== null) {
				onConfirm?.(dataUrl);
			}
			closeModal();
		}, [getResult, onConfirm, closeModal]);

		useImperativeHandle(
			ref,
			() => ({
				open: openModal,
				close: closeModal,
				getResult,
				setImage,
				confirm: handleConfirm
			}),
			[openModal, closeModal, getResult, setImage, handleConfirm]
		);

		useEffect(() => {
			if (isModalOpen) {
				document.body.classList.add('modal-open');
			} else {
				document.body.classList.remove('modal-open');
			}
			return () => {
				document.body.classList.remove('modal-open');
			};
		}, [isModalOpen]);

		useEffect(() => {
			const handleEscape = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					closeModal();
				}
			};
			if (isModalOpen) {
				window.addEventListener('keydown', handleEscape);
			}
			return () => window.removeEventListener('keydown', handleEscape);
		}, [isModalOpen, closeModal]);

		const handleOverlayClick = (e: React.MouseEvent) => {
			if (e.target === e.currentTarget) {
				closeModal();
			}
		};

		if (!isModalOpen || !selectedImage) {
			return null;
		}

		return createPortal(
			<div
				className={cls.overlay}
				onClick={handleOverlayClick}
				role='dialog'
				aria-modal='true'
			>
				<FocusTrap
					active={isModalOpen}
					focusTrapOptions={{
						allowOutsideClick: true,
						fallbackFocus: () => modalRef.current!
					}}
				>
					<div className={cls.modalContent} ref={modalRef} tabIndex={-1}>
						<div className={cls.cropScreen}>
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
									onClick={closeModal}
									aria-label='Закрыть редактор аватара'
								>
									<Close className={cls.closeIcon} aria-hidden='true' />
								</Button>
							</div>

							<div className={cls.editorContainer}>
								<div className={cls.editorWrapper}>
									<AvatarEditor
										ref={editorRef}
										image={selectedImage}
										width={config.width}
										height={config.height}
										borderRadius={config.borderRadius}
										scale={scale}
										rotate={0}
										onLoadSuccess={handleImageLoad}
										disableBoundaryChecks={false}
										disableHiDPIScaling={false}
										color={[0, 0, 0, 0.2]}
									/>
								</div>
							</div>

							<div className={cls.controlRow}>
								<div className={cls.zoomControl}>
									<input
										type='range'
										min={minScale}
										max='3'
										step='0.01'
										value={scale}
										onChange={e => setScale(parseFloat(e.target.value))}
										className={cls.zoomSlider}
										aria-label='Масштаб изображения'
									/>
								</div>

								{isDesktop && (
									<Button
										btnType={ButtonType.BUTTON}
										theme={ButtonTheme.CIRCLE}
										className={cls.checkmark}
										onClick={handleConfirm}
										aria-label='Подтвердить выбор аватара'
									>
										<Checked className={cls.checkIcon} />
									</Button>
								)}
							</div>
						</div>
					</div>
				</FocusTrap>
			</div>,
			document.body
		);
	}
);

ImageEditor.displayName = 'ImageEditor';
