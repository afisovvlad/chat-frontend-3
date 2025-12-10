import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	count: 0,
	next: '',
	previous: '',
	results: [
		{
			id: 0,
			name: '',
			region: ''
		}
	]
};

const citiesSlice = createSlice({
	name: 'cities',
	initialState: initialState,
	reducers: {}
});

export const { reducer: citiesReducer, actions: citiesActions } = citiesSlice;
