'use client';

import { useAuthStep } from '@/entities/Auth/model/selectors';
import styles from './layout.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';

interface IChildren {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: IChildren) {
	const step = useAuthStep();
	// console.log(step);
	// console.log(step !== 'greeting');
	return (
		<div className={styles.authLayout}>
			<div
				style={{
					backgroundColor: 'var(--color-violet-20)',
					backgroundImage: `url('/images/bg/auth-bg.svg')`
				}}
				className={classNames(styles.container, {
					[styles.nogreeting]: step !== 'greeting'
				})}
			>
				{children}
			</div>
		</div>
	);
}
