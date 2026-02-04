import { BlackListSchema } from '@/entities/BlackList';
import { ChatItemSchema, ChatType } from '@/entities/Chat';
import { ContactsSchema } from '@/entities/Contacts/model';
import { ProfileSchema } from '@/entities/Profile';
import { sendWS } from '@/shared/api/WS/services/socketClient/socketClient';
import { classNames } from '@/shared/lib/classNames/classNames';
import {
	mapBlackListToUserCard,
	mapChatToUserCard,
	mapContactToUserCard,
	mapProfileToUserCard,
	UserCard,
	UserCardType
} from '@/shared/ui/UserCard';
import { useEffect } from 'react';
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
		notifications: false,
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
			content:
				'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores mollitia voluptate sed vitae nobis, hic, officiis repellat voluptatem unde praesentium animi. Id omnis, est beatae totam vel ducimus laborum distinctio?',
			files_summary: {
				types: ['string'],
				count: 0
			},
			has_replied_message: true,
			has_forwarded_message: true,
			new: false,
			created_at: 0,
			updated_at: 0
		}
	},
	{
		id: 3,
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
		notifications: false,
		new_message_count: 2340,
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
			content:
				'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores mollitia voluptate sed vitae nobis, hic, officiis repellat voluptatem unde praesentium animi. Id omnis, est beatae totam vel ducimus laborum distinctio?',
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

const contacts: ContactsSchema[] = [
	{
		uid: 'asdfasdf',
		owner_user: 'asdfasdf',
		system_contact: {
			uid: 'asdfadsf',
			avatar: '',
			avatar_url:
				'https://interesnyefakty.org/wp-content/uploads/chto-takoe-avatar.jpg',
			avatar_webp: '',
			avatar_webp_url: '',
			is_online: true,
			was_online_at: 0
		},
		first_name: 'Руслан',
		last_name: 'Дотович',
		phone: ''
	},
	{
		uid: 'asdfasdfasd',
		owner_user: 'asdfasdf',
		system_contact: {
			uid: 'asdfadsf',
			avatar: '',
			avatar_url:
				'https://interesnyefakty.org/wp-content/uploads/chto-takoe-avatar.jpg',
			avatar_webp: '',
			avatar_webp_url: '',
			is_online: false,
			was_online_at: 0
		},
		first_name: 'Руслан',
		last_name: 'Дотович',
		phone: ''
	}
];

const blackList: BlackListSchema[] = [
	{
		uid: 'asdfasdf',
		username: 'asdf',
		nickname: 'asdf',
		phone: 'asdf',
		first_name: 'Нина',
		last_name: 'Ляляля',
		avatar: '',
		avatar_url:
			'https://interesnyefakty.org/wp-content/uploads/chto-takoe-avatar.jpg',
		avatar_webp: '',
		avatar_webp_url: '',
		additional_information: '',
		birthday: 0,
		chat_id: 0,
		is_online: true,
		was_online_at: 0
	},
	{
		uid: 'asdfasdf1231321',
		username: 'asdf',
		nickname: 'asdf',
		phone: 'asdf',
		first_name: 'Нина',
		last_name: 'Ляляля',
		avatar: '',
		avatar_url:
			'https://interesnyefakty.org/wp-content/uploads/chto-takoe-avatar.jpg',
		avatar_webp: '',
		avatar_webp_url: '',
		additional_information: '',
		birthday: 0,
		chat_id: 0,
		is_online: false,
		was_online_at: 0
	}
];

const profile: ProfileSchema = {
	nickname: '@bond777',
	first_name: 'Денис',
	last_name: 'Акатов',
	patronymic: '000',
	additional_information: '',
	birthday: 0,
	email: '',
	gender: 'male',
	country: '',
	city_id: 0,
	phone: '+7 921 7797979'
};

export const ChatsPage = ({ className }: ChatsProps) => {
	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await sendWS({
					action: 'create_chat',
					object: {
						name: 'string',
						description: 'string',
						avatar: {
							filename: 'avatar.png',
							data: 'iVBORw0KGgoAAAANSUhEUgAAAUAAAAFACAYAAADNkKWqAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkEEjIZJj8LZgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAgAElEQVR42u2deZxcVZ3/3+fcW1Vd1d3V3VX...'
						},
						chat_type: 'private-group',
						uid_users_list: ['string']
					}
				});

				console.log('✅ Ответ сервера:', response);
			} catch (error) {
				console.error('❌ WS Error:', error);
			}
		};

		fetchChats();
	}, []);

	return (
		<div className={classNames(cls.Chats, {}, [className])}>
			Это карточки чатов
			{chats.map(chat => (
				<UserCard
					type={UserCardType.CHAT}
					userData={mapChatToUserCard(chat)}
					key={chat.id}
				/>
			))}
			Это карточки контактов
			{contacts.map(contact => (
				<UserCard
					type={UserCardType.CONTACT}
					userData={mapContactToUserCard(contact)}
					key={contact.uid}
				/>
			))}
			Это карточки черного списка
			{blackList.map(item => (
				<UserCard
					type={UserCardType.BLACK_LIST}
					userData={mapBlackListToUserCard(item)}
					key={item.uid}
				/>
			))}
			Это карточка профиля
			<UserCard
				userData={mapProfileToUserCard(profile)}
				type={UserCardType.PROFILE}
			/>
		</div>
	);
};
