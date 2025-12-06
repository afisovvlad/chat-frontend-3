import Link from 'next/link';
import styles from './Login.module.scss';

export const Login = () => {
	return (
		<section className={styles.login}>
			{/* <Image src={} width={179} height={161} alt='Логотип' /> */}
			<h1 className={styles.title}>А-Чат</h1>

			<Link href={`/login/phone`}>Начать</Link>
		</section>
	);
};

// =======
// import {
// 	Button,
// 	ButtonColor,
// 	ButtonSize,
// 	ButtonTheme
// } from '@/shared/ui/Button';
// import { ReactNode } from 'react';
// import cls from './Login.module.scss';

// interface LoginProps {
// 	className?: string;
// 	children?: ReactNode;
// }

// export const Login = ({ className, children }: LoginProps) => {
// 	return (
// 		<div className={cls.Login}>
// 			login
// 			{children}
// 			<Button
// 				theme={ButtonTheme.BACKGROUND}
// 				color={ButtonColor.PRIMARY}
// 				size={ButtonSize.L}
// 			>
// 				background + primary
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.BACKGROUND}
// 				color={ButtonColor.PRIMARY}
// 				size={ButtonSize.L}
// 				disabled
// 			>
// 				background + primary + disabled
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.BACKGROUND}
// 				color={ButtonColor.DANGER}
// 				size={ButtonSize.L}
// 				callBtn
// 			>
// 				background + danger
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.BACKGROUND}
// 				color={ButtonColor.GREEN}
// 				size={ButtonSize.L}
// 				callBtn
// 			>
// 				background + green
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.BACKGROUND}
// 				color={ButtonColor.PRIMARY}
// 				size={ButtonSize.S}
// 			>
// 				background + size_s
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.OUTLINE}
// 				color={ButtonColor.PRIMARY}
// 				size={ButtonSize.S}
// 			>
// 				outline + primary
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.CLEAR}
// 				color={ButtonColor.PRIMARY}
// 				size={ButtonSize.S}
// 			>
// 				clear + primary
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.CLEAR}
// 				color={ButtonColor.DANGER}
// 				size={ButtonSize.S}
// 			>
// 				clear + danger
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.CIRCLE}
// 				color={ButtonColor.PRIMARY}
// 				size={ButtonSize.S}
// 			>
// 				icn
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.CIRCLE}
// 				color={ButtonColor.TRANSPARENT}
// 				size={ButtonSize.S}
// 			>
// 				icn
// 			</Button>
// 			<Button
// 				theme={ButtonTheme.CIRCLE}
// 				color={ButtonColor.PRIMARY}
// 				size={ButtonSize.S}
// 				widthDesktop='100px'
// 				heightDesktop='100px'
// 				widthMobile='50px'
// 				heightMobile='50px'
// 			>
// 				icn
// 			</Button>
// 		</div>
// 	);
// };
