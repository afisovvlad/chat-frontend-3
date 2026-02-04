export type RequestUID = string;

export interface WSRequest<T = unknown> {
	action?: string;
	request_uid?: RequestUID;
	object?: T;
}

export interface WSResponse<T = unknown> {
	action: string;
	request_uid: RequestUID;
	status: 'OK' | 'error';
	error?: string;
	object?: T;
}

// Все твои actions
export enum WS_ACTIONS {
	CONNECT = '/ws/chat::_connect',
	ADD_MEMBERS_TO_CHAT = '/ws/chat::add_members_to_chat',
	CHANGE_STATUS_READ_MESSAGE = '/ws/chat::change_status_read_message',
	CREATE_CHAT = '/ws/chat::create_chat',
	CREATE_TEXT_MESSAGE = '/ws/chat::create_text_message',
	DELETE_CHAT = '/ws/chat::delete_chat',
	DELETE_MESSAGE = '/ws/chat::delete_message',
	EDIT_CHAT = '/ws/chat::edit_chat',
	GET_STATUS_LIST_CHAT = '/ws/chat::get_status_list_chat',
	JOIN_BY_INVITE_LINK = '/ws/chat::join_by_invite_link',
	LEAVE_CHAT = '/ws/chat::leave_chat',
	REMOVE_MEMBERS_FROM_CHAT = '/ws/chat::remove_members_from_chat',
	SELF_JOIN_CHAT = '/ws/chat::self_join_chat',
	TRANSFER_OWNER = '/ws/chat::transfer_owner',
	UPDATE_MESSAGE = '/ws/chat::update_message'
}
