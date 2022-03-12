export type JWTPayload = {
	id: number;
	username: string;
	email: string;
	avatar: string;
	role: string;
};

export type User = {
	token: string;
	payload: JWTPayload;
};

export type AuthState = {
	user: User | null;
	error: string;
};
