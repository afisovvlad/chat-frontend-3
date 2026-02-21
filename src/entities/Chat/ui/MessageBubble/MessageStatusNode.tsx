import { SentRead, SentTime, SentUnread } from '@icons/index';

interface MessageStatusNodeProps {
	status: 'sent' | 'sending' | 'unread' | 'read';
}

export const MessageStatusNode = ({ status }: MessageStatusNodeProps) => {
	if (status === 'sent') {
		return;
	}

	if (status === 'sending') {
		return <SentTime className='sentTimeIcon' />;
	}

	if (status === 'unread') {
		return <SentUnread className='sentUnreadIcon' />;
	}

	if (status === 'read') {
		return <SentRead className='sentReadIcon' />;
	}
};
