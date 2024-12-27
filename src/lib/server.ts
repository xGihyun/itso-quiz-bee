import { ApiResponse } from "./api/types";
import { User } from "./user/types";

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/session`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result: ApiResponse<User> = await response.json();

  return result;
}

