export interface SelectOption<T> {
	value: T;
	label: string;
	isDisabled?: boolean;
}

export type DateOption = SelectOption<number>;
