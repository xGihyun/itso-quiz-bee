import { User } from "@/lib/user";

export type SignInResponse = {
	user: User;
	token: string;
};
