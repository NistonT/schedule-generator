import { axiosClassic } from "@/api/interceptors";
import { IAuthForm, IAuthResponse, IRegForm } from "@/types/auth.types";
import { removeFromStorage, saveTokenStorage } from "./auth-token.service";

export enum EnumTokens {
	"ACCESS_TOKEN" = "accessToken",
	"REFRESH_TOKEN" = "refreshToken",
}

export const authService = {
	async loginMain(data: IAuthForm) {
		const response = await axiosClassic.post<IAuthResponse>(
			`/auth/login`,
			data
		);

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken);
		console.log(response);
		return response;
	},

	async registerMain(data: IRegForm) {
		const response = await axiosClassic.post<IAuthResponse>(
			`/auth/register`,
			data
		);

		return response;
	},

	async getNewTokens() {
		const response = await axiosClassic.post<IAuthResponse>(
			`/auth/login/access-token`
		);

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken);

		return response;
	},

	async logout() {
		const response = await axiosClassic.post<boolean>("auth/logout");

		if (response.data) removeFromStorage();

		return response;
	},
};
