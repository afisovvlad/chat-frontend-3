'use client';

import { NoInternetPage } from '@/pages/CommonErrors';
import { ReactNode, useEffect, useState } from 'react';

interface OnlineCheckerProps {
	children: ReactNode;
}

export function OnlineChecker({ children }: OnlineCheckerProps) {
	const [online, setOnline] = useState(true);

	useEffect(() => {
		const updateOnlineStatus = () => setOnline(navigator.onLine);

		updateOnlineStatus();
		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);

		return () => {
			window.removeEventListener('online', updateOnlineStatus);
			window.removeEventListener('offline', updateOnlineStatus);
		};
	}, []);

	if (!online) {
		return <NoInternetPage />;
	}

	return <>{children}</>;
}
