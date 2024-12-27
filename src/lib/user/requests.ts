import { ApiResponse } from "../api/types";
import { User } from "./types";

export async function getUserById(userId: string): Promise<ApiResponse<User>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
		{
			method: "GET"
		}
	);

	const result: ApiResponse<User> = await response.json();

	return result;
}
