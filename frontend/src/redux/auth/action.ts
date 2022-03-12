export const loginAction = (token: string) => ({
	type: "@@Auth/login" as const,
	token,
});

export const logoutAction = () => ({ type: "@@Auth/logout" as const });

export const registerAction = (token: string) => ({
	type: "@@Auth/register" as const,
	token,
});

export const authApiFailedAction = (msg: string) => ({
	type: "@@Auth/apiFailed" as const,
	msg,
});

export type AuthAction =
	| ReturnType<typeof loginAction>
	| ReturnType<typeof logoutAction>
	| ReturnType<typeof registerAction>
	| ReturnType<typeof authApiFailedAction>;
