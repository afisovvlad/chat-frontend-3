export type MessageFormTypes = {
	message: string;
	file: FilePayload;
};

export type FilePayload = {
	filename: string;
	data: string;
};

export type SendMessageParams = {
	content?: string;
	files?: FilePayload[];
	replyIds?: string[];
	forwardIds?: string[];
};
