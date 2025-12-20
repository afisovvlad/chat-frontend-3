import { ChatItemSchema, ChatType } from '@/entities/Chat';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Chats.module.scss';

interface ChatsProps {
	className?: string;
}

const chats: ChatItemSchema[] = [
	{
		id: 1,
		chat: {
			uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			username: 'Владлен',
			nickname: 'afisovvlad',
			first_name: 'Владислав',
			last_name: 'Афисов',
			avatar: 'string',
			avatar_url:
				'https://interesnyefakty.org/wp-content/uploads/chto-takoe-avatar.jpg',
			avatar_webp: 'string',
			avatar_webp_url: 'string',
			is_blocked: false,
			is_online: true,
			was_online_at: 0,
			is_in_contacts: true
		},
		is_favorite: true,
		notifications: true,
		new_message_count: 2,
		new_file_count: 0,
		name: 'asdf',
		chat_type: ChatType.CHAT,
		chat_key: 'string',
		last_activity_at: 0,
		last_seen_message: {
			id: 1,
			uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
		},
		first_new_message: {
			id: 1,
			uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
		},
		last_message: {
			id: 1,
			uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			from_user: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			content: 'string',
			files_summary: {
				types: ['string', 'asdf'],
				count: 0
			},
			has_replied_message: false,
			has_forwarded_message: false,
			new: true,
			created_at: 0,
			updated_at: 0
		}
	},
	{
		id: 2,
		chat: {
			uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			username: 'Айрат123',
			nickname: 'Airat',
			first_name: 'Айрат',
			last_name: 'Хабибулаев',
			avatar: 'string',
			avatar_url:
				'https://interesnyefakty.org/wp-content/uploads/chto-takoe-avatar.jpg',
			avatar_webp: 'string',
			avatar_webp_url: 'string',
			is_blocked: false,
			is_online: true,
			was_online_at: 0,
			is_in_contacts: true
		},
		is_favorite: true,
		notifications: true,
		new_message_count: 2,
		new_file_count: 0,
		name: 'asdf',
		chat_type: ChatType.CHAT,
		chat_key: 'string',
		last_activity_at: 0,
		last_seen_message: {
			id: 0,
			uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
		},
		first_new_message: {
			id: 0,
			uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
		},
		last_message: {
			id: 0,
			uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			from_user: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			content: 'string',
			files_summary: {
				types: ['string'],
				count: 0
			},
			has_replied_message: true,
			has_forwarded_message: true,
			new: true,
			created_at: 0,
			updated_at: 0
		}
	}
];

export const Chats = ({ className }: ChatsProps) => {
	return (
		<div className={classNames(cls.Chats, {}, [className])}>
			{/* {chats.map(chat => (
				<ChatListItem chat={chat} key={chat.id}></ChatListItem>
			))} */}
		</div>
	);
};
