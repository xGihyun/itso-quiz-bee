export enum UserRole {
  Player = "player",
  Admin = "admin",
}

export type User = {
  user_id: string;
  email: string;
  role: UserRole;
};
