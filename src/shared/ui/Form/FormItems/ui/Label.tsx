import clsx from 'clsx';
import styles from './styles.module.scss';

interface LabelProps {
	children: React.ReactNode;
	isError?: boolean;
	classNameParentLabel?: string;
	name: string;
}

export function Label({
	children,
	isError,
	classNameParentLabel,
	name
}: LabelProps) {
	return (
		<label
			className={clsx(styles.label, classNameParentLabel, {
				[styles.hasError]: isError
			})}
			htmlFor={name}
		>
			{children}
		</label>
	);
}
