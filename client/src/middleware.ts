import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { EnumTokens } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
	const { url, cookies } = request;

	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value;

	// Страница Администратора
	const isDashboardPage = url.includes("/i");

	// Страница Авторизации
	const isAuthPage = url.includes("/authorization");

	// Страница Регистрации
	const isRegister = url.includes("/register");

	if (isAuthPage && refreshToken) {
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.PROFILE, url));
	}

	// register
	if (isRegister && refreshToken) {
		return NextResponse.redirect(new URL(DASHBOARD_PAGES.PROFILE, url));
	}

	if (isAuthPage) {
		return NextResponse.next();
	}

	if (!refreshToken) {
		return NextResponse.redirect(new URL("/authorization", request.url));
	}
}

export const config = {
	matcher: ["/i/:path*", "/authorization/:path"],
};
