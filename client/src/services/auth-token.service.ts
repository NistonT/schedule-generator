import Cookies from "js-cookie";
import { EnumTokens } from "./auth.service";

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);
	return accessToken || null;
};

export const saveTokenStorage = (accessToken: string) => {
	console.log(
		accessToken,
		EnumTokens.ACCESS_TOKEN,
		process.env.NEXT_PUBLIC_DOMAIN
	);
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: process.env.NEXT_PUBLIC_DOMAIN,
		sameSite: "strict",
		expires: 1,
	});
};

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN);
};
