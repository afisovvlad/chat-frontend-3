export type MessageFormTypes = {
	message: string;
	file: FilePayload;
};

export type FilePayload = {
	filename: string;
	data: string;
	type?: string;
};

export type SendMessageParams = {
	content?: string;
	files?: FilePayload[];
	replyIds?: string[];
	forwardIds?: string[];
};
