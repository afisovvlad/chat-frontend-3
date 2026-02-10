export interface IRegister {
	name: string;
	nickname: string;
}

export interface RegisterResponse {
	messages: string;
}

export type RegisterFormType = {
	name: string;
	nickname: string;
};
