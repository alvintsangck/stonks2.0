if (!process.env.REACT_APP_CONTRACT_ADDRESS) throw Error("no contract address");

export const env = {
	url:
		window.location.origin === "http://localhost:3000"
			? process.env.REACT_APP_API_ORIGIN
			: process.env.REACT_APP_API_SERVER,
	metaMask: process.env.REACT_APP_METAMASK,
	contract: process.env.REACT_APP_CONTRACT_ADDRESS,
};
