import { ContactsSchema } from '../model/types/contacts.types';

// Фиксированная временная метка: 01.01.2024 00:00:00 UTC (как в mockChats)
const FIXED_TIMESTAMP = 1704067200000;

//  Константы времени
const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

// 🔹 Валидные UUID для всех контактов (формат: 8-4-4-4-12)
const UUIDS = {
	user1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
	user2: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
	user3: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
	user4: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
	user5: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
	user6: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
	user7: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
	user8: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
	user9: 'a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d',
	user10: 'b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e',
	user11: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
	user12: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
	user13: 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b',
	user14: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c',
	user15: 'a3b4c5d6-e7f8-4a9b-0c1d-2e3f4a5b6c7d',
	user16: 'b4c5d6e7-f8a9-4b0c-1d2e-3f4a5b6c7d8e',
	user17: 'c5d6e7f8-a9b0-4c1d-2e3f-4a5b6c7d8e9f',
	user18: 'd6e7f8a9-b0c1-4d2e-3f4a-5b6c7d8e9f0a',
	user19: 'e7f8a9b0-c1d2-4e3f-4a5b-6c7d8e9f0a1b',
	user20: 'f8a9b0c1-d2e3-4f4a-5b6c-7d8e9f0a1b2c',
	user21: 'a9b0c1d2-e3f4-4a5b-6c7d-8e9f0a1b2c3d',
	user22: 'b0c1d2e3-f4a5-4b6c-7d8e-9f0a1b2c3d4e',
	user23: 'c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f',
	user24: 'd2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a'
} as const;

export const mockContacts: ContactsSchema[] = [
	// ─────────────────────────────────────────────────────────────
	//  ГРУППА 1: Контакты, синхронизированные с mockChats (12 шт)
	// ─────────────────────────────────────────────────────────────

	// 1. Влад Ляшев (user1) — онлайн, чат есть
	{
		uid: UUIDS.user1,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user1,
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
		uid: UUIDS.user2,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user2,
			avatar: '/images/mockUserPhoto/user_3.jpg',
			avatar_url: '/images/mockUserPhoto/user_3.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_3.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 3600000
		},
		first_name: 'Сергей',
		last_name: 'Евтушенко',
		phone: '+7 (900) 222-33-44',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 20000
	},

	// 3. Инна Георгиевна (user3) — онлайн
	{
		uid: UUIDS.user3,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user3,
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
		uid: UUIDS.user4,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user4,
			avatar: '/images/mockUserPhoto/user_2.jpg',
			avatar_url: '/images/mockUserPhoto/user_2.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_2.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 7200000
		},
		first_name: 'Константин',
		last_name: 'Передвиженский',
		phone: '+7 (900) 444-55-66',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 40000
	},

	// 5. Анастасия Бортиковая (user5) — онлайн
	{
		uid: UUIDS.user5,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user5,
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
		uid: UUIDS.user6,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user6,
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
		uid: UUIDS.user7,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user7,
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
		uid: UUIDS.user8,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user8,
			avatar: '/images/mockUserPhoto/user_1.jpg',
			avatar_url: '/images/mockUserPhoto/user_1.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_1.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 24 * HOUR
		},
		first_name: 'Алексей',
		last_name: 'Митрофанов',
		phone: '+7 (900) 888-99-00',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 80000
	},

	// 9. Александра Петрова (user9) — онлайн
	{
		uid: UUIDS.user9,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user9,
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
		uid: UUIDS.user10,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user10,
			avatar: '/images/mockUserPhoto/user_2.jpg',
			avatar_url: '/images/mockUserPhoto/user_2.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_2.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 1200000
		},
		first_name: 'Дмитрий',
		last_name: 'Иванов',
		phone: '+7 (900) 000-11-22',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 100000
	},

	// 11. Елена Смирнова (user11) — онлайн
	{
		uid: UUIDS.user11,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user11,
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
		uid: UUIDS.user12,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user12,
			avatar: '/images/mockUserPhoto/user_3.jpg',
			avatar_url: '/images/mockUserPhoto/user_3.jpg',
			avatar_webp: '',
			avatar_webp_url: '/images/mockUserPhoto/user_3.webp',
			is_online: false,
			was_online_at: FIXED_TIMESTAMP - 5000000
		},
		first_name: 'Михаил',
		last_name: 'Кузнецов',
		phone: '+7 (900) 222-33-45',
		is_in_contacts: true,
		created_at: FIXED_TIMESTAMP - 120000
	},

	// ─────────────────────────────────────────────────────────────
	// 🔹 ГРУППА 2: Дополнительные контакты для тестов сортировки (12 шт)
	// ─────────────────────────────────────────────────────────────

	// 🟡 "был(а) только что" (~30 сек назад)
	{
		uid: UUIDS.user13,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user13,
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
		uid: UUIDS.user14,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user14,
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
		uid: UUIDS.user15,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user15,
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
		uid: UUIDS.user16,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user16,
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
		uid: UUIDS.user17,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user17,
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
		uid: UUIDS.user18,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user18,
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
		uid: UUIDS.user19,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user19,
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
		uid: UUIDS.user20,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user20,
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
		uid: UUIDS.user21,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user21,
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
		uid: UUIDS.user22,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user22,
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
		uid: UUIDS.user23,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user23,
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
		uid: UUIDS.user24,
		owner_user: 'current-user-uid',
		system_contact: {
			uid: UUIDS.user24,
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
