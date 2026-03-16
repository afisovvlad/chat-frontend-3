import { ContactsPage } from '@/pages/Contacts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Контакты | А-Чат',
	keywords: 'Контакты, А-Чат, мессенджер, список пользователей',
	description: 'Список ваших контактов для начала общения | А-Чат'
};

const Contacts = () => {
	return <ContactsPage />;
};

export default Contacts;
