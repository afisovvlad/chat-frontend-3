// import { useForm } from 'react-hook-form';
import styles from './RegisterForm.module.scss';

export function RegisterForm() {
	// const {
	// 	register,
	// 	handleSubmit,
	// 	formState: { errors }
	// } = useForm();
	// const onSubmit = (data: any) => {
	// 	console.log(data);
	// };

	return (
		<>
			<div className={styles.register}>Регистрация</div>

			{/* <form onSubmit={handleSubmit(data => console.log(data))}>
				<label htmlFor='firstName'>Введите имя</label>
				<input {...register('firstName', { required: true })} />	
				{errors.firstName && <p style={{color: 'red'}}>Name is required.</p>}

				<label htmlFor='lastName'>Введите фамилию</label>
				<input {...register('lastName', { required: true })} />
				{errors.lastName && <p style={{color: 'red'}}>Last name is required.</p>}

				<label htmlFor='age'>Введите возраст</label>
				<input {...register('age', { pattern: /\d+/ })} />
				{errors.age && <p style={{color: 'red'}}>Please enter number for age.</p>}

				<input type='submit' />
			</form> */}
		</>
	);
}
