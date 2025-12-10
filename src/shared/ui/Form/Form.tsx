'use client';
import styles from './Form.module.scss';
import { ReactNode } from 'react';
import {
	FieldValues,
	FormProvider,
	SubmitHandler,
	useForm,
	UseFormProps
} from 'react-hook-form';

interface FormProps<T extends FieldValues> {
	children: ReactNode;
	onSubmit: SubmitHandler<T>;
	options?: UseFormProps<T>;
}

export const Form = <T extends FieldValues>({
	children,
	onSubmit,
	options
}: FormProps<T>) => {
	const methods = useForm<T>(options);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className={styles.form}>
				{children}
			</form>
		</FormProvider>
	);
};
