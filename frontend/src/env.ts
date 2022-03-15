if (!process.env.REACT_APP_CONTRACT_ADDRESS) throw Error("no contract address");
if (!process.env.REACT_APP_FINNHUB_KEY) throw Error("no finnhub key");
if (!process.env.REACT_APP_PRIVATE_KEY) throw Error("no crypto wallet private key");

export const env = {
	url:
		window.location.origin === "http://localhost:3000"
			? process.env.REACT_APP_API_ORIGIN
			: process.env.REACT_APP_API_SERVER,
	metaMask: process.env.REACT_APP_METAMASK,
	contract: process.env.REACT_APP_CONTRACT_ADDRESS,
	finnhubKey: process.env.REACT_APP_FINNHUB_KEY,
	privateKey: process.env.REACT_APP_PRIVATE_KEY,
};
