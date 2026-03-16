'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import styles from './layout.module.scss';

interface IChildren {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: IChildren) {
	return (
		<div className={styles.authLayout}>
			<div
				style={{
					backgroundColor: 'var(--color-violet-20)',
					backgroundImage: `url('/images/bg/auth-bg.svg')`
				}}
				className={classNames(styles.container, {})}
			>
				{children}
			</div>
		</div>
	);
}
