export type ModalSize =
	| 'compact' // 280px
	| 'regular' // 360px
	| 'wide' // 400px
	| 'extraWide' // 432px
	| 'mobileNarrow' // 329px
	| 'mobileWide'; // 361px

export const MODAL_SIZES_PX: Record<ModalSize, `${number}px`> = {
	compact: '280px',
	regular: '360px',
	wide: '400px',
	extraWide: '432px',
	mobileNarrow: '329px',
	mobileWide: '361px'
};
