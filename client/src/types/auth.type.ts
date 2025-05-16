import { IUser } from "./user.type";

export interface IAuthorizationForm {
	username: string;
	password: string;
}

export type TypeUserForm = Omit<IUser, "id"> & { password?: string };

export interface IUpdatePassword {
	passwordOld: string;
	password: string;
	passwordConfirm: string;
}

export interface IPassword {
	password: string;
}

export interface IRegistrationRequest {
	username: string;
	email: string;
	password: string;
}

export interface IRegistrationForm {
	username: string;
	email: string;
	password: string;
	passwordConfirm: string;
	isConfirm: string;
}

export interface IAuthorizationResponse {
	accessToken: string;
	user: IUser;
}
