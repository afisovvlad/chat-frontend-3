'use client';

import { useEffect, useState } from 'react';
import { Chat } from '@/widgets/Chat/index';
import { Contacts } from '@/widgets/Contacts/index';
import { Settings } from '@/widgets/Settings/index';
import { Service } from '@/widgets/Service/index';
import { Sidebar } from '@/widgets/Sidebar';
import cls from './page.module.scss';
import { BottomNav } from '@/widgets/Sidebar/ui/bottomNav/bottomNav';

export default function HomePage() {
	const [activeTab, setActiveTab] = useState('chat');
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth <= 576);
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	if (isMobile === null) {
		return null;
	}

	const renderContent = () => {
		switch (activeTab) {
			case 'chat':
				return <Chat />;
			case 'service':
				return <Service />;
			case 'contacts':
				return <Contacts />;
			case 'settings':
				return <Settings />;
			default:
				return <div>Выберите вкладку</div>;
		}
	};

	return (
		<div className={cls.pageWrapper}>
			{/* Десктоп: боковое меню */}
			{!isMobile && (
				<Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
			)}

			{/* Мобильная версия: нижняя панель */}
			{isMobile && (
				<BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
			)}

			<div className={cls.content}>{renderContent()}</div>
		</div>
	);
}
