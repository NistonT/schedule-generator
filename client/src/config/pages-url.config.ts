// Страницы для админки
class DASHBOARD {
	private root = "/i";

	HOME = "/";
	AUTHORIZATION = `/authorization`;
	REGISTRATION = `/registration`;
	DOCUMENTATION = `/documentation`;
	PROFILE = `${this.root}/profile`;
	GENERATION = `${this.root}/generation`;
	GENERATION_ID = `${this.root}/generation/`;
	SCHEDULE = `${this.root}/schedule`;
	SCHEDULE_ID = `${this.root}/schedule/`;
	SETTING = `${this.root}/setting`;
	ABOUT = `${this.root}/about`;
	FEEDBACK = `${this.root}/feedback`;
	ADMIN_PANEL = `${this.root}/admin-panel`;
}

export const DASHBOARD_PAGES = new DASHBOARD();
