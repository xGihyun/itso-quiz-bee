import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DataTable } from "./-components/data-table";
import { columns, UserColumn } from "./-components/columns";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseStatus } from "@/lib/api/types";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateUserForm } from "./-components/form";
import { UserRole } from "@/lib/user/types";

export const Route = createFileRoute("/_auth/users/")({
	component: RouteComponent,
});

function RouteComponent() {
	const query = useQuery({
		queryKey: ["users"],
		queryFn: getAllUsers
	});

	if (query.isPending) {
		return <Skeleton className="h-20 w-20" />;
	}

	if (query.isError) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{query.data?.message}</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4 px-20 py-10">
			<Dialog>
				<DialogTrigger asChild>
					<Button>Create</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create User</DialogTitle>
						<DialogDescription>
							Enter the user's details below.
						</DialogDescription>
					</DialogHeader>

					<CreateUserForm />
				</DialogContent>
			</Dialog>

			<DataTable columns={columns} data={query.data.data} />
		</div>
	);
}

async function getAllUsers(): Promise<ApiResponse<UserColumn[]>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/users`,
		{
			method: "GET",
			credentials: "include"
		}
	);

	const result: ApiResponse<UserColumn[]> = await response.json();

	return result;
}
