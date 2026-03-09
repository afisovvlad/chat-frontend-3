import { ContactsSchema } from '../model/types/contacts.types';

// Фиксированная временная метка: 01.01.2024 00:00:00 UTC (как в mockChats)
const FIXED_TIMESTAMP = 1704067200000;

//  Константы времени
const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const mockContacts: ContactsSchema[] = [
	// ─────────────────────────────────────────────────────────────
	//  ГРУППА 1: Контакты, синхронизированные с mockChats (12 шт)
	//  system_contact.uid === chat.uid из ChatList — для тестов перехода
	// ─────────────────────────────────────────────────────────────

	// 1. Влад Ляшев (user1) — онлайн, чат есть
	{
		uid: 'contact-user1',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user1', // 🔹 Совпадает с chat.uid в mockChats
			avatar: '/images/mockUserPhoto/user_1.jpg',
			avatar_url: '/images/mockUserPhoto/user_1.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_1.webp',
			is_online: true,
			was_online_at: FIXED_TIMESTAMP
		},
		first_name: 'Влад',
		last_name: 'Ляшев',
		phone: '+7 (900) 111-22-33',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 10000
	},

	// 2. Сергей Евтушенко (user2) — офлайн, чат есть
	{
		uid: 'contact-user2',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user2',
			avatar: '/images/mockUserPhoto/user_3.jpg',
			avatar_url: '/images/mockUserPhoto/user_3.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_3.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 3600000 // 1 час назад
		},
		first_name: 'Сергей',
		last_name: 'Евтушенко',
		phone: '+7 (900) 222-33-44',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 20000
	},

	// 3. Инна Георгиевна (user3) — онлайн
	{
		uid: 'contact-user3',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user3',
			avatar: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_4.webp',
			is_online: true,
			was_online_at: FIXED_TIMESTAMP
		},
		first_name: 'Инна',
		last_name: 'Георгиевна',
		phone: '+7 (900) 333-44-55',
		is_in_contacts: false,
		created_at: FIXED_TIMESTAMP - 30000
	},

	// 4. Константин Передвиженский (user4) — офлайн
	{
		uid: 'contact-user4',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user4',
			avatar: '/images/mockUserPhoto/user_2.jpg',
			avatar_url: '/images/mockUserPhoto/user_2.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_2.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 7200000 // 2 часа назад
		},
		first_name: 'Константин',
		last_name: 'Передвиженский',
		phone: '+7 (900) 444-55-66',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 40000
	},

	// 5. Анастасия Бортиковая (user5) — онлайн
	{
		uid: 'contact-user5',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user5',
			avatar: '/images/mockUserPhoto/user_w_5.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_5.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_5.webp',
			is_online: true,
			was_online_at: FIXED_TIMESTAMP
		},
		first_name: 'Анастасия',
		last_name: 'Бортиковая',
		phone: '+7 (900) 555-66-77',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 50000
	},

	// 6. Ванесса Рейхарт (user6) — онлайн
	{
		uid: 'contact-user6',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user6',
			avatar: '/images/mockUserPhoto/user_w_6.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_6.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_6.webp',
			is_online: true,
			was_online_at: FIXED_TIMESTAMP
		},
		first_name: 'Ванесса',
		last_name: 'Рейхарт',
		phone: '+7 (900) 666-77-88',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 60000
	},

	// 7. Илья Макаров (user7) — онлайн
	{
		uid: 'contact-user7',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user7',
			avatar: '/images/mockUserPhoto/user_3.jpg',
			avatar_url: '/images/mockUserPhoto/user_3.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_3.webp',
			is_online: true,
			was_online_at: FIXED_TIMESTAMP
		},
		first_name: 'Илья',
		last_name: 'Макаров',
		phone: '+7 (900) 777-88-99',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 70000
	},

	// 8. Алексей Митрофанов (user8) — офлайн, давно
	{
		uid: 'contact-user8',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user8',
			avatar: '/images/mockUserPhoto/user_1.jpg',
			avatar_url: '/images/mockUserPhoto/user_1.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_1.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 24 * HOUR // 1 день назад
		},
		first_name: 'Алексей',
		last_name: 'Митрофанов',
		phone: '+7 (900) 888-99-00',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 80000
	},

	// 9. Александра Петрова (user9) — онлайн
	{
		uid: 'contact-user9',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user9',
			avatar: '/images/mockUserPhoto/user_w_5.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_5.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_5.webp',
			is_online: true,
			was_online_at: FIXED_TIMESTAMP
		},
		first_name: 'Александра',
		last_name: 'Петрова',
		phone: '+7 (900) 999-00-11',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 90000
	},

	// 10. Дмитрий Иванов (user10) — офлайн
	{
		uid: 'contact-user10',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user10',
			avatar: '/images/mockUserPhoto/user_2.jpg',
			avatar_url: '/images/mockUserPhoto/user_2.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_2.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 1200000 // 20 минут назад
		},
		first_name: 'Дмитрий',
		last_name: 'Иванов',
		phone: '+7 (900) 000-11-22',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 100000
	},

	// 11. Елена Смирнова (user11) — онлайн
	{
		uid: 'contact-user11',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user11',
			avatar: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_4.webp',
			is_online: true,
			was_online_at: FIXED_TIMESTAMP
		},
		first_name: 'Елена',
		last_name: 'Смирнова',
		phone: '+7 (900) 111-22-34',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 110000
	},

	// 12. Михаил Кузнецов (user12) — офлайн
	{
		uid: 'contact-user12',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user12',
			avatar: '/images/mockUserPhoto/user_3.jpg',
			avatar_url: '/images/mockUserPhoto/user_3.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_3.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 5000000 // ~1.4 часа назад
		},
		first_name: 'Михаил',
		last_name: 'Кузнецов',
		phone: '+7 (900) 222-33-45',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 120000
	},

	// ─────────────────────────────────────────────────────────────
	// 🔹 ГРУППА 2: Дополнительные контакты для тестов сортировки (12 шт)
	// 🔹 Разные was_online_at для проверки: только что / минуты / часы / вчера / дата
	// ─────────────────────────────────────────────────────────────

	// 🟡 "был(а) только что" (~30 сек назад)
	{
		uid: 'contact-user13',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user13',
			avatar: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_4.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 30 * SEC
		},
		first_name: 'Ольга',
		last_name: 'Новикова',
		phone: '+7 (900) 333-44-56',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 130000
	},

	// 🟡 "был(а) 5 минут назад"
	{
		uid: 'contact-user14',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user14',
			avatar: '/images/mockUserPhoto/user_2.jpg',
			avatar_url: '/images/mockUserPhoto/user_2.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_2.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 5 * MIN
		},
		first_name: 'Андрей',
		last_name: 'Соколов',
		phone: '+7 (900) 444-55-67',
		is_in_contacts: false,
		created_at: FIXED_TIMESTAMP - 140000
	},

	// 🟡 "был(а) 15 минут назад"
	{
		uid: 'contact-user15',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user15',
			avatar: '/images/mockUserPhoto/user_w_6.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_6.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_6.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 15 * MIN
		},
		first_name: 'Татьяна',
		last_name: 'Морозова',
		phone: '+7 (900) 555-66-78',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 150000
	},

	// 🟡 "был(а) 22 минуты назад" (по ТЗ)
	{
		uid: 'contact-user16',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user16',
			avatar: '/images/mockUserPhoto/user_3.jpg',
			avatar_url: '/images/mockUserPhoto/user_3.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_3.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 22 * MIN
		},
		first_name: 'Иван',
		last_name: 'Попов',
		phone: '+7 (900) 666-77-89',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 160000
	},

	// 🟡 "был(а) 30 минут назад"
	{
		uid: 'contact-user17',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user17',
			avatar: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_4.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 30 * MIN
		},
		first_name: 'Мария',
		last_name: 'Волкова',
		phone: '+7 (900) 777-88-90',
		is_in_contacts: false,
		created_at: FIXED_TIMESTAMP - 170000
	},

	// 🟡 "был(а) 3 часа назад"
	{
		uid: 'contact-user18',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user18',
			avatar: '/images/mockUserPhoto/user_1.jpg',
			avatar_url: '/images/mockUserPhoto/user_1.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_1.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 3 * HOUR
		},
		first_name: 'Сергей',
		last_name: 'Федоров',
		phone: '+7 (900) 888-99-01',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 180000
	},

	// 🟡 "был(а) 12 часов назад"
	{
		uid: 'contact-user19',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user19',
			avatar: '/images/mockUserPhoto/user_w_5.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_5.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_5.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 12 * HOUR
		},
		first_name: 'Анна',
		last_name: 'Смирнова',
		phone: '+7 (900) 999-00-12',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 190000
	},

	// 🟡 "был(а) 22 часа назад" (по ТЗ)
	{
		uid: 'contact-user20',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user20',
			avatar: '/images/mockUserPhoto/user_2.jpg',
			avatar_url: '/images/mockUserPhoto/user_2.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_2.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 22 * HOUR
		},
		first_name: 'Максим',
		last_name: 'Разработчик',
		phone: '+7 (900) 000-11-23',
		is_in_contacts: false,
		created_at: FIXED_TIMESTAMP - 200000
	},

	// 🟡 "был(а) вчера в 21:15" (по ТЗ) — 2ч 45м до полуночи 01.01
	{
		uid: 'contact-user21',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user21',
			avatar: '/images/mockUserPhoto/user_w_6.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_6.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_6.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 2 * HOUR - 45 * MIN
		},
		first_name: 'Ольга',
		last_name: 'Дизайнер',
		phone: '+7 (900) 111-22-35',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 210000
	},

	// 🟡 "был(а) 2 дня назад"
	{
		uid: 'contact-user22',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user22',
			avatar: '/images/mockUserPhoto/user_3.jpg',
			avatar_url: '/images/mockUserPhoto/user_3.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_3.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 2 * DAY
		},
		first_name: 'Тест',
		last_name: 'Пользователь',
		phone: '+7 (900) 222-33-46',
		is_in_contacts: false,
		created_at: FIXED_TIMESTAMP - 220000
	},

	// 🟡 "был(а) 02.04.23" (по ТЗ) — ~9 месяцев назад
	{
		uid: 'contact-user23',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user23',
			avatar: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_url: '/images/mockUserPhoto/user_w_4.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_w_4.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 274 * DAY
		},
		first_name: 'Ярослав',
		last_name: 'Андреев',
		phone: '+7 (900) 333-44-57',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 230000
	},

	// 🟡 Контакт без аватара (проверка fallback)
	{
		uid: 'contact-user24',
		owner_user: 'current-user-uid',
		system_contact: {
			uid: 'user24',
			avatar: '',
			avatar_url: '',
			avatar_webp: '',
			avatar_webp_url: '',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 48 * HOUR
		},
		first_name: 'Алиса',
		last_name: 'Васильева',
		phone: '+7 (900) 444-55-68',
		is_in_contacts: false,
		created_at: FIXED_TIMESTAMP - 240000
	}
];
