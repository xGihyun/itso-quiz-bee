import { RegisterRequest } from "@/lib/user/types";
import { ColumnDef } from "@tanstack/react-table";

export type UserColumn = RegisterRequest;

export const columns: ColumnDef<UserColumn>[] = [
  {
    id: "fullName",
    header: "Name",
    accessorFn: (row) => `${row.last_name}, ${row.first_name}`,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
