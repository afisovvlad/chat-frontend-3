import { formatTime } from '@/shared/lib/formatTime/formatTime';
import { useEffect, useState } from 'react';
import styles from './TimeLeft.module.scss';

interface TimeLeftProps {
	initialTime: number;
	setFinishedTime: (arg: boolean) => void;
}

export function TimeLeft({ initialTime, setFinishedTime }: TimeLeftProps) {
	const [timeLeft, setTimeLeft] = useState(initialTime);

	useEffect(() => {
		setTimeLeft(initialTime);
	}, [initialTime]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prev => Math.max(prev - 1, 0));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (timeLeft === 0) {
			setFinishedTime(true);
		}
	}, [timeLeft, setFinishedTime]);

	return <span className={styles.timeLeft}>{formatTime(timeLeft)}</span>;
}
