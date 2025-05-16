import { axiosClassic } from "@/api/interceptors";
import { AxiosResponse } from "axios";
import {
	IAuthorizationForm,
	IAuthorizationResponse,
	IRegistrationRequest,
} from "../types/auth.type";
import { removeFromStorage, saveTokenStorage } from "./auth-token.service";

export enum EnumTokens {
	"ACCESS_TOKEN" = "accessToken",
	"REFRESH_TOKEN" = "refreshToken",
}

export const authService = {
	async loginMain(
		data: IAuthorizationForm
	): Promise<AxiosResponse<IAuthorizationResponse>> {
		const response = await axiosClassic.post<IAuthorizationResponse>(
			`/auth/login`,
			data
		);

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken);
		console.log(response);
		return response;
	},

	async registerMain(
		data: IRegistrationRequest
	): Promise<AxiosResponse<IAuthorizationResponse>> {
		const response = await axiosClassic.post<IAuthorizationResponse>(
			`/auth/register`,
			data
		);

		return response;
	},

	async getNewTokens(): Promise<AxiosResponse<IAuthorizationResponse>> {
		const response = await axiosClassic.post<IAuthorizationResponse>(
			`/auth/login/access-token`
		);

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken);

		return response;
	},

	async logout(): Promise<AxiosResponse<boolean>> {
		const response = await axiosClassic.post<boolean>("auth/logout");

		if (response.data) removeFromStorage();

		return response;
	},
};
