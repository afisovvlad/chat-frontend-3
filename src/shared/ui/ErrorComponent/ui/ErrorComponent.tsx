import { ErrorComponentProps } from '..';
import styles from './ErrorComponent.module.scss';

export function ErrorComponent({ children }: ErrorComponentProps) {
	return <p className={styles.error}>{children}</p>;
}
