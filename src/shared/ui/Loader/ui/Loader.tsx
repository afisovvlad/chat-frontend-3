import styles from './Loader.module.scss';
import { LoaderIcon } from '@icons/index';
import { LoaderProps } from '..';

export function Loader({ width, height }: LoaderProps) {
	return <LoaderIcon className={styles.loader} width={width} height={height} />;
}
