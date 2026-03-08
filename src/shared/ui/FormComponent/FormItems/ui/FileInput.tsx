import { classNames } from '@/shared/lib/classNames/classNames';
import styles from './styles.module.scss';

interface FileInputProps {
	children: React.ReactNode;
	isHidden?: boolean;
	parentClass?: string;
}
export function FileInput({ children, isHidden, parentClass }: FileInputProps) {
	return (
		<label className={classNames(styles.label, {}, [parentClass])}>
			<input type='file' style={{ display: isHidden ? 'none' : 'block' }} />
			{children}
		</label>
	);
}
