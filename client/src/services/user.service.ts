import { axiosWithAuto } from "@/api/interceptors";
import { IPassword, TypeUserForm } from "@/types/auth.type";
import { IGitHubUser } from "@/types/git.type";
import { IUser } from "@/types/user.type";
import axios, { AxiosResponse } from "axios";

class UserService {
	private BASE_URL = "/user";

	public async getUserId(): Promise<AxiosResponse<IUser>> {
		const response = await axiosWithAuto.get<IUser>(`${this.BASE_URL}/user_id`);
		return response;
	}

	public async getAllUser(): Promise<AxiosResponse<IUser[]>> {
		const response = await axiosWithAuto.get<IUser[]>(`${this.BASE_URL}/users`);
		return response;
	}

	// useProfile>useQuery

	public async update(data: TypeUserForm): Promise<AxiosResponse<IUser>> {
		const response = await axiosWithAuto.put<IUser>(
			`${this.BASE_URL}/update`,
			data
		);
		return response;
	}

	public async updateApi(): Promise<AxiosResponse<IUser>> {
		const response = await axiosWithAuto.put<IUser>(`${this.BASE_URL}/api_key`);
		return response;
	}

	public async check(password: IPassword): Promise<boolean> {
		const response = await axiosWithAuto.post<boolean>(
			`${this.BASE_URL}/check`,
			password
		);
		console.log(response);

		return response.data;
	}

	public async gitHub(): Promise<AxiosResponse<IGitHubUser>> {
		const response = await axios.get<IGitHubUser>(
			`https://api.github.com/users/NistonT`
		);

		return response;
	}
}

export const userService = new UserService();
