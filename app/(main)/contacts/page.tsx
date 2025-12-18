// ContactsTab.tsx

'use client';

import { Text, TextType } from '@/shared/ui/Text';
import cls from './Contacts.module.scss';

const Contacts = () => {
	return (
		<div className={cls.placeholder}>
			{/* Тестовое наполнение — удалить в проде */}
			<div className={cls.header}>
				<Text type={TextType.TITLE} className={cls.title}>
					Контакты пользователей А-чата
				</Text>
				<div className={cls.searchBar}>
					<input placeholder='Поиск' className={cls.searchInput} />
				</div>
			</div>

			<div className={cls.contactList}>
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className={cls.contactItem}>
						<div className={cls.avatar}></div>
						<div className={cls.info}>
							<Text type={TextType.TITLE} className={cls.name}>
								Пользователь {i + 1}
							</Text>
							<Text type={TextType.TEXT} className={cls.status}>
								в сети
							</Text>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Contacts;
