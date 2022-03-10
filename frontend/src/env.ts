export const env =
	window.location.origin === "http://localhost:3000"
		? process.env.REACT_APP_API_ORIGIN
		: process.env.REACT_API_SERVER;
