'use client';

import { useGetCitiesQuery } from '../api/citiesApi';

export const Cities = () => {
	const { isLoading, data: cities, error } = useGetCitiesQuery('');
	// const { isLoading, data: cities, error } = useGetCodeMutation();

	console.log(cities);

	if (isLoading) {
		return <div>ЗАГРУЗКА</div>;
	}

	if (error) {
		return <div>ОШИБКА</div>;
	}

	return <div>СМОТРЕТЬ КОНСОЛЬ</div>;
};
