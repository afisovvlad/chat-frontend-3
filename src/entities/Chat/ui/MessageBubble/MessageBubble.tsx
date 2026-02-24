import { formatUnixToLocalTime } from '@/shared/lib/formatUnixToLocalTime/formatUnixToLocalTime';
import { Text, TextColor, TextSize } from '@/shared/ui/Text';
import { MessageStatusNode } from './MessageStatusNode';
import './MessageBubble.scss';

interface MessageBubbleProps {
	time: number;
	text: string;
	status: 'received' | 'sending' | 'unread' | 'read';
}

export const MessageBubble = ({ time, text, status }: MessageBubbleProps) => {
	return (
		<div
			className={`message ${status !== 'received' ? 'message--sent' : 'message--received'}`}
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
