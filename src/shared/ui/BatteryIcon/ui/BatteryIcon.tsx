type Props = {
	percent: number;
	charging?: boolean;
};

export function BatteryIcon({ percent, charging }: Props) {
	const width = Math.max(0, Math.min(100, percent));

	return (
		<svg viewBox='0 0 28 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<rect
				opacity='0.35'
				x='0.5'
				y='0.5'
				width='24'
				height='12'
				rx='3.8'
				stroke='currentColor'
			/>
			<path
				opacity='0.4'
				d='M26 4.78113V8.8566C26.8047 8.51143 27.328 7.70847 27.328 6.81886C27.328 5.92926 26.8047 5.1263 26 4.78113Z'
				fill='currentColor'
			/>
			<rect x='2' y='2' width='21' height='9' rx='2.5' fill='#1C1C1E' />
			{charging && (
				<text x='11' y='9' fontSize='6' textAnchor='middle' fill='#fff'>
					⚡
				</text>
			)}
		</svg>

		// <svg width='27.33' height='13' viewBox='0 0 26 12'>
		// 	<rect
		// 		x='0.5'
		// 		y='0.5'
		// 		width='22'
		// 		height='11'
		// 		rx='2'
		// 		stroke='currentColor'
		// 		fill='none'
		// 	/>
		// 	<rect
		// 		x='1.5'
		// 		y='1.5'
		// 		width={(20 * width) / 100}
		// 		height='9'
		// 		rx='1'
		// 		fill='currentColor'
		// 	/>
		// 	<rect x='23' y='4' width='2.5' height='4' rx='1' fill='currentColor' />

		// {charging && (
		// 	<text x='11' y='9' fontSize='6' textAnchor='middle' fill='#fff'>
		// 		⚡
		// 	</text>
		// )}
		// </svg>
	);
}
