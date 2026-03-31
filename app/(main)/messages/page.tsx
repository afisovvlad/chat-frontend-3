import { GetMessagesRequest, MessagesList } from '@/entities/Chat';
import { MESSAGES_ORDERING, MESSAGES_PAGE_SIZE } from '@/shared/model';

interface PageProps {
	params: {
		uid: string;
	};
}

export default function Page({ params }: PageProps) {
	const queryArgs: GetMessagesRequest = {
		user_uid: params.uid,
		page_size: MESSAGES_PAGE_SIZE,
		ordering: MESSAGES_ORDERING
	};

	return <MessagesList queryArgs={queryArgs} />;
}
