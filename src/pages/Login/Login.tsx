import {
	Button,
	ButtonColor,
	ButtonSize,
	ButtonTheme
} from '@/shared/ui/Button/Button';
import { ReactNode } from 'react';
import cls from './Login.module.scss';

interface LoginProps {
	className?: string;
	children?: ReactNode;
}

export const Login = ({ className, children }: LoginProps) => {
	return (
		<div className={cls.Login}>
			login
			{children}
			<Button
				theme={ButtonTheme.BACKGROUND}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.L}
			>
				background + primary
			</Button>
			<Button
				theme={ButtonTheme.BACKGROUND}
				color={ButtonColor.DANGER}
				size={ButtonSize.L}
				callBtn
			>
				background + danger
			</Button>
			<Button
				theme={ButtonTheme.BACKGROUND}
				color={ButtonColor.GREEN}
				size={ButtonSize.L}
				callBtn
			>
				background + green
			</Button>
			<Button
				theme={ButtonTheme.OUTLINE}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.S}
			>
				outline + primary
			</Button>
			<Button
				theme={ButtonTheme.CLEAR}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.S}
			>
				clear + primary
			</Button>
			<Button
				theme={ButtonTheme.CLEAR}
				color={ButtonColor.DANGER}
				size={ButtonSize.S}
			>
				clear + danger
			</Button>
			<Button
				theme={ButtonTheme.CIRCLE}
				color={ButtonColor.PRIMARY}
				size={ButtonSize.S}
			>
				icn
			</Button>
			<Button
				theme={ButtonTheme.CIRCLE}
				color={ButtonColor.TRANSPARENT}
				size={ButtonSize.S}
			>
				icn
			</Button>
		</div>
	);
};
