// Страницы для админки
class DASHBOARD {
	private root = "/i";

	HOME = "/";
	AUTHORIZATION = `/authorization`;
	REGISTRATION = `/registration`;
	DOCUMENTATION = `${this.root}/documentation`;
	PROFILE = `${this.root}/profile`;
}

export const DASHBOARD_PAGES = new DASHBOARD();
