'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { ReactNode } from 'react';
import {
	FieldValues,
	FormProvider,
	SubmitHandler,
	UseFormReturn
} from 'react-hook-form';
import styles from './Form.module.scss';

interface FormProps<T extends FieldValues> {
	children: ReactNode;
	onSubmit: SubmitHandler<T>;
	className?: string;
	methods: UseFormReturn<T>;
}

export const Form = <T extends FieldValues>({
	children,
	onSubmit,
	className,
	methods
}: FormProps<T>) => {
	const { handleSubmit } = methods;
	return (
		<FormProvider {...methods}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={classNames(styles.form, {}, [className])}
				noValidate
			>
				{children}
			</form>
		</FormProvider>
	);
};
