import Image from 'next/image';
import { Text, TextAlign, TextColor, TextSize } from '../Text';
import cls from './NotMessage.module.scss';

const NotMessage = () => {
	return (
		<div className={cls.wrapper}>
			<Image
				src='/images/png/img_frog Web.png'
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
					Сообщений пока нет
				</Text>
				<Text
					color={TextColor.GRAY}
					fontSize={TextSize.S}
					textAlign={TextAlign.CENTER}
				>
					Напишите первым :)
				</Text>
			</div>
		</div>
	);
};

export default NotMessage;
