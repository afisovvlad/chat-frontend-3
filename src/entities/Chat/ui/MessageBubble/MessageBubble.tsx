import { formatUnixToLocal } from './lib/formatUnixToLocal';
import { Text, TextColor, TextSize } from '@/shared/ui/Text';
import { MessageStatusNode } from './MessageStatusNode';
import './MessageBubble.scss';

interface MessageBubbleProps {
	time: number;
	isSent: boolean;
	text: string;
	status: 'sent' | 'sending' | 'unread' | 'read';
}

export const MessageBubble = ({
	time,
	isSent,
	text,
	status
}: MessageBubbleProps) => {
	return (
		<div
			className={`message ${isSent ? 'message--sent' : 'message--received'}`}
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
					{formatUnixToLocal(time)}
				</Text>

				{!isSent && <MessageStatusNode status={status} />}
			</div>
		</div>
	);
};
