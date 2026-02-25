import { formatUnixToLocalTime } from '@/shared/lib/formatUnixToLocalTime/formatUnixToLocalTime';
import { Text, TextColor, TextSize } from '@/shared/ui/Text';
import { MessageStatusNode } from './MessageStatusNode';
import './MessageBubble.scss';

interface MessageBubbleProps {
	id: string;
	time: number;
	text: string;
	status: 'received' | 'sending' | 'unread' | 'read';
	onClick: (id: string) => void;
}

export const MessageBubble = ({
	id,
	time,
	text,
	status,
	onClick
}: MessageBubbleProps) => {
	const messageClass = `message ${status !== 'received' ? 'message--sent' : 'message--received'}`;

	const handleActivate = () => {
		onClick(id);
	};

	return (
		<div
			className={messageClass}
			role='button'
			tabIndex={0}
			onClick={handleActivate}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					handleActivate();
				}
			}}
		>
			<Text lineHeight={1.3} color={TextColor.BLACK} className='message__text'>
				{text}
			</Text>

			<div className='message__meta'>
				<Text
					lineHeight={1.2}
					fontSize={TextSize.S}
					color={TextColor.GRAY}
					className='message__time'
				>
					{formatUnixToLocalTime(time)}
				</Text>

				{status !== 'received' && <MessageStatusNode status={status} />}
			</div>
		</div>
	);
};
