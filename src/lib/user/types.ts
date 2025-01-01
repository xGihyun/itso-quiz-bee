export enum UserRole {
	Player = "player",
	Admin = "admin"
}

export type User = {
	user_id: string;
	created_at: string;
	username: string;
	name: string;
	role: UserRole;
	avatar_url?: string;
};
