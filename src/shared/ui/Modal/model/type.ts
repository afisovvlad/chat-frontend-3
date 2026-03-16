export const MODAL_SIZES = {
	compact: '280px',
	regular: '360px',
	wide: '400px',
	extraWide: '432px',
	mobileNarrow: '329px',
	mobileWide: '361px'
} as const;

export type ModalSize = keyof typeof MODAL_SIZES;

export const MODAL_BORDER_RADIUS = {
	'8px': '8px',
	'12px': '12px',
	'16px': '16px'
} as const;

export type ModalBorderRadius = keyof typeof MODAL_BORDER_RADIUS;
