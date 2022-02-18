const env = process.env.REACT_APP_API_ORIGIN;

export async function callApi(url: string, method: string, body?: any) {
	try {
		const res = await fetch(env + url, {
			method,
			headers: { "Content-Type": body ? "application/json" : "text/plain" },
			body: body ? JSON.stringify(body) : undefined,
		});
		return await res.json();
	} catch (error) {
		console.log(error);
		return { error: String(error) };
	}
}
