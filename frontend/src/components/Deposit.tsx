import "../css/Deposit.css";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getBalanceThunk } from "../redux/metaMask/thunk";
import { RootState } from "../redux/store/state";
import { OnboardingButton } from "./OnboardingButton";
import SwitchChianButton from "./SwitchChainButton";
import { getChainIdThunk, getMetaMaskThunk } from "../redux/metaMask/thunk";
import { getMetaMaskAction, getChainIdAction } from "../redux/metaMask/action";
import TransferForm from "./TransferForm";

export default function Payment() {
	const dispatch = useDispatch();
	const account = useSelector((state: RootState) => state.metaMask.account);
	const chainId = useSelector((state: RootState) => state.metaMask.chainId);
	const balance = useSelector((state: RootState) => state.metaMask.balance);
	const ethereum = window.ethereum;

	function handleNewAccount(newAccount: string[]) {
		dispatch(getMetaMaskAction(newAccount[0]));
	}

	function handleChainChanged(chainId: string) {
		dispatch(getChainIdAction(parseInt(chainId, 16)));
	}

	useEffect(() => {
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			dispatch(getMetaMaskThunk());
			dispatch(getChainIdThunk());
			dispatch(getBalanceThunk());
			ethereum.on("accountsChanged", handleNewAccount);
			ethereum.on("chainChanged", handleChainChanged);
			return () => {
				ethereum.removeListener("accountsChanged", handleNewAccount);
				ethereum.removeListener("chainChanged", handleChainChanged);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Container className="deposit-container">
			<Row className="align-items-center">
				<Col lg={6} className="status-bar">
					<div>MetaMask:{account ? " Connected" : <OnboardingButton />}</div>
				</Col>
				<Col lg={6} className="status-bar">
					<div>Balance: {balance} STONK</div>
				</Col>
			</Row>
			<Row className="align-items-center">
				<Col lg={6} className="status-bar">
					<div className="d-flex align-items-center">
						<div>Current Chain: {getChainName(chainId)}</div>
						{chainId !== 43113 && <SwitchChianButton />}
					</div>
				</Col>
				<Col lg={6} className="status-bar">
					<div className="d-flex align-items-center">
						<div>Import token to MetaMask</div>
						<button className="stonk-btn" onClick={addTokenAddress}>
							import token
						</button>
					</div>
				</Col>
			</Row>
			<TransferForm />
		</Container>
	);
}

function getChainName(chainId: number) {
	if (chainId === 1) return "Ethereum Mainnet";
	if (chainId === 43113) return "Avalanche C-Chain";
	return "unknown";
}

async function addTokenAddress() {
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
