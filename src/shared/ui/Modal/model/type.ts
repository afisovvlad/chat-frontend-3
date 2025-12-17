export const MODAL_SIZES = {
	compact: '280px',
	regular: '360px',
	wide: '400px',
	extraWide: '432px',
	mobileNarrow: '329px',
	mobileWide: '361px'
} as const;

export type ModalSize = keyof typeof MODAL_SIZES;
