'use client';

import { Text, TextType } from '@/shared/ui/Text';
import { BlackList, Edit, Forward, Logout, Support, Trash } from '@icons/index';
import cls from './settings.module.scss';
import { Container, ContainerType } from '@/shared/ui/Container';

const Settings = () => {
	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				<div className={cls.placeholder}>
					{/* Тестовое наполнение — удалить в проде */}
					<div className={cls.profileSection}>
						<div className={cls.avatarWrapper}>
							<div className={cls.avatar}></div>
						</div>
						<div className={cls.profileInfo}>
							<Text type={TextType.TITLE}>Сергей Иванов</Text>
							<Text>+7 921 7797979</Text>
							<Text>@bond777</Text>
						</div>
					</div>

					<div className={cls.options}>
						<div className={cls.option}>
							<span>
								<Edit /> Редактирование профиля
							</span>
							<span>
								<Forward />
							</span>
						</div>
						<div className={cls.option}>
							<span>
								<BlackList /> Чёрный список
							</span>
							<span>
								<Forward />
							</span>
						</div>
						<div className={cls.option}>
							<span>
								<Support /> Поддержка
							</span>
							<span>
								<Forward />
							</span>
						</div>
						<div className={cls.option}>
							<span>
								<Logout /> Выйти из аккаунта
							</span>
						</div>
					</div>

					<div className={cls.deleteProfile}>
						<span>
							<Trash /> Удалить профиль
						</span>
					</div>
				</div>
			</Container>

			<Container type={ContainerType.CONTENT}>
				<div className={cls.rightCont}></div>
			</Container>
		</Container>
	);
};

export default Settings;
