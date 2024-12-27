import {
	createContext,
	JSX,
	ReactNode,
	useContext,
	useState,
	useEffect
} from "react";
import { User } from "../user/types";
import { getCookie } from "typescript-cookie";
import { getUserById } from "../user/requests";
import { ApiResponseStatus } from "../api/types";

export type AuthContextValue = {
	user: User | null;
	validateSession: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue>({
	user: null,
	validateSession: async () => null
});

type AuthProviderProps = {
	children: ReactNode;
};

export function AuthProvider(props: AuthProviderProps): JSX.Element {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		validateSession();
	}, []);

	async function validateSession(): Promise<User | null> {
		const session = getCookie("session");

		if (!session) {
			console.warn("No session.");
			setUser(null);
			return null;
		}

		const response = await getUserById(session);

		if (response.status !== ApiResponseStatus.Success) {
			console.error("Failed to get user:", response);
			setUser(null);
			return null;
		}

		setUser(response.data);
		return response.data;
	}

	return (
		<AuthContext value={{ user, validateSession }}>
			{props.children}
		</AuthContext>
	);
}

export function useAuth(): AuthContextValue {
	return useContext(AuthContext);
}
