'use client';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';

import cls from './Login.module.scss';

export const Login = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	const isMobile = useMediaQuery('(max-width: 768px)');

	const modalBorderRadius = isMobile ? '8px' : '16px';

	const overlayMode = isMobile ? 'full' : 'container';

	return (
		<section ref={containerRef} className={cls.login}>
			<h1 className={cls.title}>А-Чат</h1>

			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				overlayMode={overlayMode}
				containerRef={containerRef}
				closeButton={true}
				overlayBorderRadius={modalBorderRadius}
				size='regular'
			>
				<div className={cls.welcomeContent}>
					<h2>Добро пожаловать!</h2>
					<p>Это модальное окно с overlay внутри контейнера.</p>
					<Button onClick={closeModal}>Закрыть</Button>
				</div>
			</Modal>

			<Button onClick={openModal} className={cls.btn}>
				Открыть модалку
			</Button>

			<Button className={cls.btn}></Button>
			<Link href={`/login/phone`}>Начать</Link>
		</section>
	);
};
