'use client';

import { Battery } from '@/shared/assets/icons';
import { useBattery } from '@/shared/lib/battery/useBattery';
import { BatteryIcon } from '@/shared/ui/BatteryIcon';

export function StatusBar() {
	const battery = useBattery();

	console.log(battery);

	if (!battery) {
		return <Battery width={27.33} height={13} />;
	}

	return (
		<BatteryIcon
			percent={Math.round(battery.level * 100)}
			charging={battery.charging}
		/>
	);
}
