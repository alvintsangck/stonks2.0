import { Navigate, Outlet, RouteProps } from "react-router-dom";
import { useAppSelector } from "../hook/hooks";

export default function PrivateRoute({ children }: RouteProps) {
  const user = useAppSelector((state) => state.auth.user);
  return user ? (
    <>
      {children}
      <Outlet />
    </>
  ) : (
    <Navigate replace to={{ pathname: "/login" }} />
  );
}
