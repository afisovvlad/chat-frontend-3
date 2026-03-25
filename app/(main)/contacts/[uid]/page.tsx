import { ContactsPage } from '@/pages/Contacts';
import type { Metadata } from 'next';

type Props = {
	params: Promise<{ uid: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { uid } = await params;

	return {
		title: `Контакт | А-Чат`,
		description: `Просмотр контакта ${uid} | А-Чат`
	};
}

const ContactDetail = async ({ params }: Props) => {
	// uid уже будет в URL, ContactsPage сам его прочитает через useParams()
	return <ContactsPage />;
};

export default ContactDetail;
