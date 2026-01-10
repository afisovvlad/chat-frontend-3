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
	shouldSubmit?: boolean;
	className?: string;
	methods: UseFormReturn<T>;
}

export const Form = <T extends FieldValues>({
	children,
	onSubmit,
	className,
	methods
}: FormProps<T>) => {
	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit)}
				className={classNames(styles.form, {}, [className])}
				noValidate
			>
				{children}
			</form>
		</FormProvider>
	);
};
