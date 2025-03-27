// Страницы для админки
class DASHBOARD {
	private root = "/i";

	HOME = "/";
	AUTHORIZATION = `/authorization`;
	REGISTRATION = `/registration`;
	DOCUMENTATION = `/documentation`;
	PROFILE = `${this.root}/profile`;
	GENERATION = `${this.root}/generation`;
	SCHEDULE = `${this.root}/schedule`;
	SETTING = `${this.root}/setting`;
	ABOUT = `${this.root}/about`;
}

export const DASHBOARD_PAGES = new DASHBOARD();
