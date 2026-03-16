'use client';
import { useRef } from 'react';
import { AuthFlow } from '@/widgets/AuthFlow';
import styles from './LoginPage.module.scss';

export function LoginPage() {
	const loginSectionRef = useRef<HTMLDivElement>(null);
	return (
		<section ref={loginSectionRef} className={styles.login}>
			<AuthFlow containerRef={loginSectionRef} />
		</section>
	);
}
