'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import { Button, ButtonColor, ButtonTheme } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { useLogout } from '@/shared/lib/hooks/useLogout/useLogout';
import { settingsMenuItems } from '../../model/SettingsMenuConfig';
import { classNames } from '@/shared/lib/classNames/classNames';
import { usePathname } from 'next/navigation';
import { Forward } from '@icons/index';
import cls from './SettingsMenu.module.scss';

interface SettingsMenuProps {
	className?: string;
}

export const SettingsMenu = ({ className }: SettingsMenuProps) => {
	const pathname = usePathname();
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const performLogout = useLogout();

	const handleLogoutConfirm = async () => {
		await performLogout();
		setIsLogoutModalOpen(false);
	};

	return (
		<>
			<div className={classNames(cls.SettingsMenu, {}, [className])}>
				{settingsMenuItems.map(item => {
					const Icon = item.Icon;

					// Пункт "Выйти из аккаунта"
					if (!item.href) {
						return (
							<Button
								key={item.id}
								theme={ButtonTheme.CLEAR}
								className={cls.SettingsMenuItem}
								onClick={() => setIsLogoutModalOpen(true)}
								aria-label={item.title}
							>
								<Icon className={cls.SettingsMenuIcon} />
								<Text
									type={TextType.TEXT}
									fontSize={TextSize.M}
									color={TextColor.BLACK}
									fontWeight={FontWeight.REGULAR}
									className={cls.label}
								>
									{item.label}
								</Text>
							</Button>
						);
					}

					// Обычные ссылки
					const href = item.href || '#';
					const isActive = pathname?.startsWith(href) || false;

					return (
						<Link
							key={item.id}
							href={href}
							className={classNames(cls.SettingsMenuItem, {
								[cls.active]: isActive
							})}
							aria-label={item.title}
						>
							<Icon className={cls.SettingsMenuIcon} />
							<Text
								type={TextType.TEXT}
								fontSize={TextSize.M}
								color={TextColor.BLACK}
								fontWeight={FontWeight.REGULAR}
								className={cls.label}
							>
								{item.label}
							</Text>

							<Forward className={cls.arrow} />
						</Link>
					);
				})}
			</div>

			{/* Модальное окно подтверждения выхода */}
			<Modal
				size='wide'
				isOpen={isLogoutModalOpen}
				onClose={() => setIsLogoutModalOpen(false)}
				closeButton
				className={cls.logoutModal}
			>
				<Text
					type={TextType.TITLE}
					fontSize={TextSize.L}
					className={cls.modalTitle}
				>
					Выход из аккаунта
				</Text>
				<Text
					type={TextType.TEXT}
					fontSize={TextSize.M}
					className={cls.modalText}
				>
					Вы действительно хотите выйти из аккаунта?
				</Text>
				<Modal.Actions className={cls.actions}>
					<Button
						color={ButtonColor.TRANSPARENT}
						onClick={() => setIsLogoutModalOpen(false)}
						className={cls.btnCancel}
					>
						Отмена
					</Button>
					<Button
						color={ButtonColor.PRIMARY}
						onClick={handleLogoutConfirm}
						className={cls.btnDelete}
					>
						Выйти
					</Button>
				</Modal.Actions>
			</Modal>
		</>
	);
};
