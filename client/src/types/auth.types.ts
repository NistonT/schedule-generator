export interface IAuthForm {
	username: string;
	password: string;
}

export type TypeUserForm = Omit<IUser, "id"> & { password?: string };

export interface IRegisterForm {
	username: string;
	email: string;
	password: string;
}

export interface IUser {
	id: string;
	username: string;
	email: string;
	password: string;
	schedule_id: null;
	api_key: string;
	CreatedAt: string;
	UpdatedAt: string;
}

export interface IAuthResponse {
	id: string;
	username: string;
	email: string;
	schedule_id: null;
	api_key: string;
	CreatedAt: string;
	UpdatedAt: string;
	accessToken: string;
}
