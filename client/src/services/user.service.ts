import { axiosWithAuto } from "@/api/interceptors";
import { IPassword, IUser, TypeUserForm } from "@/types/auth.types";
import { GitHubUser } from "@/types/git.types";
import axios from "axios";

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

	async updateApi() {
		const response = await axiosWithAuto.put(`${this.BASE_URL}/api_key`);
		return response;
	}

	async check(password: IPassword): Promise<boolean> {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}/check`,
			password
		);
		console.log(response);

		return response.data;
	}

	async gitHub(): Promise<GitHubUser | null> {
		try {
			const response = await axios.get<GitHubUser>(
				`https://api.github.com/users/NistonT`
			);

			return response.data;
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}

export const userService = new UserService();
