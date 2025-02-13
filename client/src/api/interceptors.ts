import {
	getAccessToken,
	removeFromStorage,
} from "@/services/auth-token.service";
import { authService } from "@/services/auth.service";
import axios, { type CreateAxiosDefaults } from "axios";
import { errorCatch } from "./error";

const options: CreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
};

// Без авторизации
const axiosClassic = axios.create(options);

// Авторизация
const axiosWithAuto = axios.create(options);

axiosWithAuto.interceptors.request.use(config => {
	const accessToken = getAccessToken();

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`;

	return config;
});

axiosWithAuto.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config;

		if (
			(error?.response?.status === 401 || errorCatch(error) === "jwt expired",
			errorCatch(error) === "jwt must be provided") &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true;
			try {
				await authService.getNewTokens();
				return axiosWithAuto.request(originalRequest);
			} catch {
				if (errorCatch(error) === "jwt expired") removeFromStorage();
			}
		}

		throw error;
	}
);

export { axiosClassic, axiosWithAuto };
