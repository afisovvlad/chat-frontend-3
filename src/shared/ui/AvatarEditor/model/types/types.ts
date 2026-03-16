export interface ImageEditorRef {
	confirm: () => Promise<void>;
}

export interface ImageEditorConfig {
	width: number;
	height: number;
	borderRadius: number;
}
