import Image from 'next/image';
import { Text, TextAlign, TextColor, TextSize } from '../Text';
import cls from './NotSearch.module.scss';

export const NotSearch = () => {
	return (
		<div className={cls.wrapper}>
			<Image
				src='/images/png/NotSearch.png'
				alt='Нет сообщений'
				width={200}
				height={200}
			/>
			<div>
				<Text
					color={TextColor.GRAY}
					fontSize={TextSize.L}
					textAlign={TextAlign.CENTER}
				>
					Поиск не дал результатов
				</Text>
				<Text
					color={TextColor.GRAY}
					fontSize={TextSize.S}
					textAlign={TextAlign.CENTER}
				>
					По вашему запросу ничего не найдено. Измените запрос и попробуйте
					снова
				</Text>
			</div>
		</div>
	);
};
