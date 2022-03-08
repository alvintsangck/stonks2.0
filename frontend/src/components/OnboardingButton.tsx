import MetaMaskOnboarding from "@metamask/onboarding";
import { useState, useRef, useEffect } from "react";

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

export function OnboardingButton() {
	const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
	const [isDisabled, setDisabled] = useState(false);
	const [accounts, setAccounts] = useState<any[]>([]);
	const onboarding = useRef<MetaMaskOnboarding>();

	function handleNewAccounts(newAccounts: any[]) {
		setAccounts(newAccounts);
	}

	useEffect(() => {
		if (!onboarding.current) {
			onboarding.current = new MetaMaskOnboarding();
		}
	}, []);

	useEffect(() => {
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			if (accounts.length > 0) {
				setButtonText(CONNECTED_TEXT);
				setDisabled(true);
				onboarding.current!.stopOnboarding();
			} else {
				setButtonText(CONNECT_TEXT);
				setDisabled(false);
			}
		}
	}, [accounts]);

	useEffect(() => {
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			window.ethereum.request({ method: "eth_requestAccounts" }).then(handleNewAccounts);
			window.ethereum.on("accountsChanged", handleNewAccounts);

			return () => {
				window.ethereum.removeListener("accountsChanged", handleNewAccounts);
			};
		}
	}, []);

	const onClick = async () => {
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			const newAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			setAccounts(newAccounts);
		} else {
			onboarding.current!.startOnboarding();
		}
	};
	return (
		<button disabled={isDisabled} onClick={onClick}>
			{buttonText}
		</button>
	);
}
