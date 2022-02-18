export const loginAction = () => ({ type: "@@Auth/login" as const });

export const logoutAction = () => ({ type: "@@Auth/logout" as const });

export const registerAction = () => ({ type: "@@Auth/register" as const });

export const authApiFailedAction = (action: string, msg: string) => ({
	type: "@@Auth/apiFailed" as const,
	action,
	msg,
});

export type AuthAction =
	| ReturnType<typeof loginAction>
	| ReturnType<typeof logoutAction>
	| ReturnType<typeof registerAction>
	| ReturnType<typeof authApiFailedAction>;
