'use client';

import { formatUnixToLocalTime } from '@/shared/lib/formatUnixToLocalTime/formatUnixToLocalTime';
import { FontWeight, Text, TextColor, TextSize } from '@/shared/ui/Text';
import { MessageStatusNode } from './MessageStatusNode';
import './MessageBubble.scss';

interface MessageBubbleProps {
	id: string;
	time: number;
	text: string;
	status: 'received' | 'sending' | 'unread' | 'read';
	onClick: (id: string) => void;

	isGroupChat?: boolean;
	senderName?: string;
	senderAvatar?: string;

	isFirstInGroup?: boolean;
	isLastInGroup?: boolean;
}

export const MessageBubble = ({
	id,
	time,
	text,
	status,
	onClick,

	isGroupChat = false,
	senderName,
	senderAvatar,
	isFirstInGroup = false,
	isLastInGroup = false
}: MessageBubbleProps) => {
	const messageClass = `message ${
		status !== 'received' ? 'message--sent' : 'message--received'
	}`;

	const isGroupReceived = isGroupChat && status === 'received';
	const isSingle = isGroupReceived && isFirstInGroup && isLastInGroup;

	const showName =
		isGroupReceived && senderName && (isFirstInGroup || isSingle);

	const showAvatar =
		isGroupReceived && senderAvatar && (isLastInGroup || isSingle);

	const handleActivate = () => {
		onClick(id);
	};

	return (
		<div className='message-wrapper'>
			<div className='message-row'>
				{isGroupReceived && (
					<div
						className={`message-avatar-slot ${
							showAvatar ? '' : 'message-avatar-slot--hidden'
						}`}
					>
						{showAvatar && (
							<img
								src={senderAvatar}
								alt={senderName}
								className='message__avatar'
							/>
						)}
					</div>
				)}

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
					{showName && (
						<Text
							fontWeight={FontWeight.BOLD}
							fontSize={TextSize.S}
							color={TextColor.ACCENT}
							className='message__sender'
						>
							{senderName}
						</Text>
					)}

					<div className='message__content'>
						<Text
							lineHeight={1.3}
							color={TextColor.BLACK}
							className='message__text'
						>
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
				</div>
			</div>
		</div>
	);
};
