import { AuthFlow } from '@/widgets/AuthFlow';
import styles from './LoginPage.module.scss';

export function LoginPage() {
	return (
		<section className={styles.login}>
			<AuthFlow />
		</section>
	);
}
