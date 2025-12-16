'use client';
import clsx from 'clsx';
import { ReactNode } from 'react';
import {
	FieldValues,
	FormProvider,
	SubmitHandler,
	// UseFormProps,
	UseFormReturn
} from 'react-hook-form';
import styles from './Form.module.scss';

interface FormProps<T extends FieldValues> {
	children: ReactNode;
	onSubmit: SubmitHandler<T>;
	// options?: UseFormProps<T>;
	className?: string;
	methods: UseFormReturn<T>;
}

export const Form = <T extends FieldValues>({
	children,
	onSubmit,
	// options,
	className,
	methods
}: FormProps<T>) => {
	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit)}
				className={clsx(styles.form, className)}
			>
				{children}
			</form>
		</FormProvider>
	);
};
