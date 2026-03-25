import Image from 'next/image';
import { Text, TextAlign, TextColor, TextSize } from '../Text';

import cls from './EmptyContacts.module.scss';

const EmptyContacts = () => {
	return (
		<div className={cls.wrapper}>
			<div className={cls.infoBlock}>
				<Image
					src='/images/png/emptyContacts.png'
					alt='Нет чатов'
					width={200}
					height={200}
				/>
				<div className={cls.text}>
					<Text
						color={TextColor.GRAY}
						fontSize={TextSize.L}
						textAlign={TextAlign.CENTER}
					>
						Список контактов пока пуст
					</Text>
					<Text
						color={TextColor.GRAY}
						fontSize={TextSize.S}
						textAlign={TextAlign.CENTER}
					>
						Начните общение и здесь всё появится
					</Text>
				</div>
			</div>
		</div>
	);
};

export default EmptyContacts;
