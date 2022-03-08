import { OnboardingButton } from "./OnboardingButton";
import SwitchChianButton from "./SwitchChainButton";

export default function Payment() {
	return (
		<>
			{/* <OnboardingButton /> */}
			<SwitchChianButton />
			<button onClick={addToken}>add token</button>
		</>
	);
}

async function addToken() {
	try {
		await window.ethereum.request({
			method: "wallet_watchAsset",
			params: {
				type: "ERC20",
				options: {
					address: "0x6baad065aa5173e16783d35f607265b5b2750264", // The address that the token is at.
					symbol: "ALVIN", // A ticker symbol or shorthand, up to 5 chars.
					decimals: 18, // The number of decimals in the token
					image: "http://localhost:8080/STONK.png", // A string url of the token logo
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
}
