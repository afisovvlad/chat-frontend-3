// import {
// 	FontWeight,
// 	Text,
// 	TextAlign,
// 	TextColor,
// 	TextSize,
// 	TextTag,
// 	TextType,
// 	TitleTag
// } from '@/shared/ui/Text';
// import Link from 'next/link';
// import styles from './Login.module.scss';
// import { Logo } from '@icons/index';

// export const Login = () => {
// 	return (
// 		<section className={styles.login}>
// 			<Logo className={styles.logo} />
// 			<Text
// 				type={TextType.TITLE}
// 				tag={TitleTag.H1}
// 				fontSize={TextSize.XXL}
// 				fontWeight={FontWeight.SEMI_BOLD}
// 				textAlign={TextAlign.CENTER}
// 				className={styles.title}
// 			>
// 				А-Чат
// 			</Text>
// 			<Text
// 				type={TextType.TEXT}
// 				tag={TextTag.P}
// 				fontSize={TextSize.L}
// 				fontWeight={FontWeight.REGULAR}
// 				textAlign={TextAlign.CENTER}
// 				color={TextColor.VIOLET}
// 				className={styles.text}
// 			>
// 				Привет!
// 			</Text>
// 			<Text
// 				type={TextType.TEXT}
// 				tag={TextTag.P}
// 				fontSize={TextSize.L}
// 				fontWeight={FontWeight.REGULAR}
// 				textAlign={TextAlign.CENTER}
// 				color={TextColor.VIOLET}
// 				className={styles.text}
// 			>
// 				Давай знакомиться
// 			</Text>
// 			<Link href={`/login/phone`} className={styles.link}>
// 				Начать
// 			</Link>
// 		</section>
// 	);
// };
