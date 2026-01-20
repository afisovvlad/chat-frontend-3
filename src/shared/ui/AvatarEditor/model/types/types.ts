export interface ImageEditorRef {
	getResult: () => Promise<string | null>;
	confirm: () => Promise<void>;
}

export interface ImageEditorConfig {
	width: number;
	height: number;
	borderRadius: number;
}
