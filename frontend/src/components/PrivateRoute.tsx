import { useSelector } from "react-redux";
import { Navigate, Outlet, RouteProps } from "react-router-dom";
import { RootState } from "../redux/store/state";

export default function PrivateRoute({ children }: RouteProps) {
	const user = useSelector((state: RootState) => state.auth.user);
	return user ? (
		<>
			{children}
			<Outlet />
		</>
	) : (
		<Navigate replace to={{ pathname: "/login" }} />
	);
}
