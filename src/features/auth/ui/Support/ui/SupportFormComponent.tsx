import { classNames } from '@/shared/lib/classNames/classNames';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { Text, TextAlign, TextType, TitleTag } from '@/shared/ui/Text';
import { Back, Logo } from '@icons/index';
import { SupportForm } from '@/features/support';
import { useAuthGoBack } from '@/features/auth';

import styles from './SupportFormComponent.module.scss';

export function SupportFormComponent() {
	const goBack = useAuthGoBack();
	// const step = useAuthStep();

	return (
		<div className={styles.loginWrapper}>
			<Logo
				className={classNames(styles.logo, {
					// [styles.support]: step === 'support'
				})}
			/>

			<Button
				theme={ButtonTheme.CLEAR}
				className={styles.btnBack}
				onClick={() => goBack()}
			>
				<Back className={styles.iconBack} />
			</Button>

			<Text
				type={TextType.TITLE}
				tag={TitleTag.H2}
				textAlign={TextAlign.CENTER}
				className={classNames(styles.subTitle, {
					// [styles.support]: step === 'support'
				})}
			>
				Служба поддержки
			</Text>
			<SupportForm />
		</div>
	);
}
