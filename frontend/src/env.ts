if (!process.env.REACT_APP_METAMASK) throw Error("no metamask account");

export const env = {
	url:
		window.location.origin === "http://localhost:3000"
			? process.env.REACT_APP_API_ORIGIN
			: process.env.REACT_APP_API_SERVER,
	metaMask: process.env.REACT_APP_METAMASK,
	contract: process.env.REACT_APP_CONTRACT_ADDRESS,
	finnhubKey: process.env.REACT_APP_FINNHUB_KEY || "c8nlj1aad3iep4je9k50",
	privateKey: process.env.REACT_APP_PRIVATE_KEY || "f14fcc1da6e36a91998428c0f7a8e78d09f020c92e702973d322bea9657d4a4d",
};
