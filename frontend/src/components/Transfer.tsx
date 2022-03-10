import "../css/Transfer.css";
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
import DepositForm from "./DepositForm";
import { Helmet } from "react-helmet";

export default function Transfer() {
	const dispatch = useDispatch();
	const account = useSelector((state: RootState) => state.metaMask.account);
	const chainId = useSelector((state: RootState) => state.metaMask.chainId);
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

			ethereum.on("accountsChanged", handleNewAccount);
			ethereum.on("chainChanged", handleChainChanged);
			return () => {
				ethereum.removeListener("accountsChanged", handleNewAccount);
				ethereum.removeListener("chainChanged", handleChainChanged);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(()=>{
		dispatch(getBalanceThunk(account));
	},[account])

	return (
		<>
			<Helmet>
				<title>Transfer | Stonks</title>
			</Helmet>
			<Container className="deposit-container">
				<Row className="justify-content-center">
					<Col md={6} className="status-bar">
						MetaMask:{account ? " Connected" : <OnboardingButton />}
					</Col>
					<Col md={6} className="status-bar">
						Current Chain: {getChainName(chainId)} {chainId !== 43113 && <SwitchChianButton />}
					</Col>
				</Row>
			</Container>
			<Container className="form-container">
				<Row className="justify-content-center">
					<Col xs={3} className="form-btn active">
						Deposit
					</Col>
					<Col xs={3} className="form-btn">
						Withdraw
					</Col>
				</Row>
				<Row className="justify-content-center">
					<Col xs={6}>
						<DepositForm />
						<div className="d-flex align-items-center">
							<div>
								<span>Didn't see the token in MetaMask?</span>
								<button className="stonk-btn" onClick={addTokenAddress}>
									import here
								</button>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</>
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
