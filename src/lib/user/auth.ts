import { User } from ".";
import { ApiResponse } from "../api/types";

export type AuthSession = {
	user: User;
	session: string;
};

export async function getAuthSession(
	token: string
): Promise<ApiResponse<AuthSession | null>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/session?token=${token}`
	);

	const result: ApiResponse<AuthSession> = await response.json();

	return result;
}
