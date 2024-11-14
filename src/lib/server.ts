import { ApiResponse } from "./types/api";
import { User } from "./types/user";

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

export const SOCKET_URL = `ws://localhost:3002/ws`;
