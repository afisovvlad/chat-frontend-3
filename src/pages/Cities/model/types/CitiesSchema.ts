export interface CitiesSchema {
	count: number;
	next: string;
	previous: string;
	results: {
		id: number;
		name: string;
		region: string;
	}[];
}
