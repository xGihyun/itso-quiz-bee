import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
	message: string;
};

export function ErrorAlert(props: Props): JSX.Element {
	return (
		<Alert variant="destructive">
			<AlertCircle className="size-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>{props.message}</AlertDescription>
		</Alert>
	);
}
