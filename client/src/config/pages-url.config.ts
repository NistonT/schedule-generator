// Страницы для админки
class DASHBOARD {
	private root = "/i";

	HOME = this.root;
	AUTHORIZATION = `${this.root}/authorization`;
	REGISTRATION = `${this.root}/registration`;
	DOCUMENTATION = `${this.root}/documentation`;
	PROFILE = `${this.root}/profile`;
}

export const DASHBOARD_PAGES = new DASHBOARD();
