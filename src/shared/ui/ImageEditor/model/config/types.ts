export interface ImageEditorRef {
	open: () => void;
	close: () => void;
	getResult: () => Promise<string | null>;
	setImage: (url: string) => void;
	confirm: () => Promise<void>;
}

export interface ImageEditorProps {
	onOpen?: () => void;
	onClose?: () => void;
	onConfirm?: (dataUrl: string) => void;
}

export interface ImageEditorConfig {
	width: number;
	height: number;
	borderRadius: number;
}
