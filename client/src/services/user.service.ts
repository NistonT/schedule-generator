import { axiosWithAuto } from "@/api/interceptors";
import { IUser, TypeUserForm } from "@/types/auth.types";

class UserService {
	private BASE_URL = "/user";

	async getUserId() {
		const response = await axiosWithAuto.get<IUser>(`${this.BASE_URL}/user_id`);
		return response;
	}

	// useProfile>useQuery

	async update(data: TypeUserForm) {
		const response = await axiosWithAuto.put(`${this.BASE_URL}/update`, data);
		return response;
	}
}

export const userService = new UserService();
