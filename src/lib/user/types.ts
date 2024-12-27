export enum UserRole {
  Player = "player",
  Admin = "admin",
}

export type User = {
  user_id: string;
  email: string;
  role: UserRole;
};

export type UserDetails = {
  first_name: string;
  middle_name: string;
  last_name: string;
};

export type RegisterRequest = User & UserDetails;
