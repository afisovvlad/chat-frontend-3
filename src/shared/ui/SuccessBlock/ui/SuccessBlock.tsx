import styles from './SuccessBlock.module.scss';
import {
	FontWeight,
	Text,
	TextAlign,
	TextColor,
	TextSize,
	TextTag,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import { Success } from '@icons/index';

export function SuccessBlock({ marginTop }: { marginTop?: string }) {
	return (
		<div className={styles.successBlock} style={{ marginTop: marginTop }}>
			<Success width={66.7} height={66.7} className={styles.successIcon} />
			<Text
				type={TextType.TITLE}
				tag={TitleTag.H2}
				fontSize={TextSize.XL}
				fontWeight={FontWeight.MEDIUM}
				textAlign={TextAlign.CENTER}
				className={styles.successTitle}
			>
				Обращение отправлено!
			</Text>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.REGULAR}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={styles.successText}
			>
				В ближайшее время вы получите ответ на электронную почту, указанную
				в обращении
			</Text>
		</div>
	);
}
