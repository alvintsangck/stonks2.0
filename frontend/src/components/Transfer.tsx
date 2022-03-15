import "../css/Transfer.css";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getTokenThunk } from "../redux/metaMask/thunk";
import { RootState } from "../redux/store/state";
import { OnboardingButton } from "./OnboardingButton";
import SwitchChianButton from "./SwitchChainButton";
import { getChainIdThunk, getMetaMaskThunk } from "../redux/metaMask/thunk";
import { getMetaMaskAction, getChainIdAction } from "../redux/metaMask/action";
import DepositForm from "./DepositForm";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";
import WithdrawalForm from "./WithdrawalForm";
import { push } from "connected-react-router";
import { defaultErrorSwal } from "./ReactSwal";

export default function Transfer() {
	const dispatch = useDispatch();
	const account = useSelector((state: RootState) => state.metaMask.account);
	const chainId = useSelector((state: RootState) => state.metaMask.chainId);
	const { method } = useParams<{ method: string }>();

	useEffect(() => {
		if (MetaMaskOnboarding.isMetaMaskInstalled() && account) {
			const ethereum = window.ethereum;
			const handleNewAccount = (newAccount: string[]) => {
				dispatch(getMetaMaskAction(newAccount[0]));
			};
			const handleChainChanged = (chainId: string) => {
				dispatch(getChainIdAction(parseInt(chainId, 16)));
			};
			dispatch(getMetaMaskThunk());
			dispatch(getChainIdThunk());
			dispatch(getTokenThunk());
			ethereum.on("accountsChanged", handleNewAccount);
			ethereum.on("chainChanged", handleChainChanged);
			return () => {
				ethereum.removeListener("accountsChanged", handleNewAccount);
				ethereum.removeListener("chainChanged", handleChainChanged);
			};
		}
	}, [dispatch, account]);

	return (
		<>
			<Helmet>
				<title>{method[0].toUpperCase() + method.substring(1, method.length)} | Stonks</title>
			</Helmet>
			<Container className="deposit-container">
				<Row className="justify-content-center">
					<Col md={3}/>
					<Col md={3} className="status-bar">
						MetaMask:{account ? " Connected" : <OnboardingButton />}
					</Col>
					<Col  className="status-bar">
						<div>Current Chain: {getChainName(chainId)}</div>
						<div>{chainId !== 43113 && <SwitchChianButton />}</div>
					</Col>
				</Row>
			</Container>
			<Container className="transfer-form-container">
				<Row className="justify-content-center">
					<Col
						xs={3}
						className={"form-btn" + (method === "deposit" ? " active" : "")}
						onClick={() => dispatch(push("/transfer/deposit"))}
					>
						Deposit
					</Col>
					<Col
						xs={3}
						className={"form-btn" + (method === "withdrawal" ? " active" : "")}
						onClick={() => dispatch(push("/transfer/withdrawal"))}
					>
						Withdraw
					</Col>
				</Row>
				<Row className="justify-content-center">
					<Col xs={6} className="">
						{method === "deposit" && <DepositForm />}
						{method === "withdrawal" && <WithdrawalForm />}
					</Col>
				</Row>
				<Row className="justify-content-center import-bar">
					<Col xs={6} className="">
						<div>
							<div>Didn't see the token in MetaMask?</div>
							<button className="stonk-btn" onClick={addTokenAddress}>
								import here
							</button>
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
					symbol: "STON", // A ticker symbol or shorthand, up to 5 chars.
					decimals: 18, // The number of decimals in the token
					image: "http://localhost:8080/STONK.png", // A string url of the token logo
				},
			},
		});
	} catch (error) {
		defaultErrorSwal(error);
	}
}
