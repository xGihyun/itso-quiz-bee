import { ApiResponse } from "../api/types";

export enum UserRole {
	Player = "player",
	Admin = "admin"
}

export type User = {
	userId: string;
	createdAt: string;
	username: string;
	name: string;
	role: UserRole;
	avatarUrl?: string;
};

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
