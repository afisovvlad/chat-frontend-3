'use client';

import { useEffect, useState } from 'react';

type BatteryInfo = {
	level: number; // 0..1
	charging: boolean;
};

export function useBattery() {
	const [battery, setBattery] = useState<BatteryInfo | null>(null);

	useEffect(() => {
		if (!('getBattery' in navigator)) {
			return;
		}

		// @ts-expect-error - getBattery() is not in TypeScript's Navigator interface
		navigator.getBattery().then((bat: BatteryManager) => {
			const update = () =>
				setBattery({
					level: bat.level,
					charging: bat.charging
				});

			update();

			bat.addEventListener('levelchange', update);
			bat.addEventListener('chargingchange', update);
		});
	}, []);

	return battery;
}
