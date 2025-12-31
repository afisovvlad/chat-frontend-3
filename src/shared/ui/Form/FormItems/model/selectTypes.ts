export interface SelectOption<T> {
	value: T;
	label: string;
}

export type DateOption = SelectOption<number>;
