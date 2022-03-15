import { ethers, Contract } from "ethers";
import { defaultErrorSwal } from "../../components/ReactSwal";
import { env } from "../../env";
import { RootDispatch } from "../store/action";
import { getBalanceAction, getChainIdAction, getMetaMaskAction } from "./action";
import Web3 from "web3";
import abi from "./abi";

const ethereum = window.ethereum;

export function getMetaMaskThunk() {
	return async (dispatch: RootDispatch) => {
		try {
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
			dispatch(getMetaMaskAction(accounts[0]));
		} catch (error) {
			defaultErrorSwal(error);
		}
	};
}

export function getChainIdThunk() {
	return async (dispatch: RootDispatch) => {
		try {
			const chainId = await ethereum.request({ method: "eth_chainId" });
			dispatch(getChainIdAction(parseInt(chainId, 16)));
		} catch (error) {
			defaultErrorSwal(error);
		}
	};
}

export function switchChainThunk() {
	return async (dispatch: RootDispatch) => {
		const AVALANCHE_TESTNET_PARAMS = {
			chainId: "0xA869",
			chainName: "Avalanche Testnet C-Chain",
			nativeCurrency: {
				name: "Avalanche",
				symbol: "AVAX",
				decimals: 18,
			},
			rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
			blockExplorerUrls: ["https://testnet.snowtrace.io/"],
		};
		try {
			await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0xA869" }] });
			dispatch(getChainIdAction(14113));
		} catch (switchError: any) {
			if (switchError.code === 4902) {
				try {
					await window.ethereum.request({
						method: "wallet_addEthereumChain",
						params: [AVALANCHE_TESTNET_PARAMS],
					});
					dispatch(getChainIdAction(14113));
				} catch (addError) {
					defaultErrorSwal(addError);
				}
			} else {
				defaultErrorSwal(switchError);
			}
		}
	};
}

export function getTokenThunk() {
	return async (dispatch: RootDispatch) => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contractAddress = "0x6baad065aa5173e16783d35f607265b5b2750264";
		const contract = new Contract(contractAddress, abi, provider);
		try {
			const balance = await contract.balanceOf(await signer.getAddress());
			const calculatedBalance = ethers.utils.formatEther(balance);
			dispatch(getBalanceAction(Number(calculatedBalance)));
		} catch (error) {
			defaultErrorSwal(error);
		}
	};
}

export function depositThunk(amount: number) {
	return async (dispatch: RootDispatch) => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new Contract(env.contract, abi, signer);
		try {
			const tx = await contract.transfer(env.metaMask, ethers.utils.parseUnits(amount.toString(), "ether"));
			const result = await tx.wait();
			if (result.confirmations === 1) {
			}
		} catch (error: any) {
			if (error.code === 4001) {
				defaultErrorSwal("Transaction denied");
			}
		}
	};
}

export function withdrawalThunk(amount: number) {
	return async (dispatch: RootDispatch) => {
		const nodeURL = "https://api.avax-test.network/ext/bc/C/rpc";
		const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);
		const contract = new Contract(env.contract, abi, HTTPSProvider);
		const wallet = new ethers.Wallet('')
		const tx = await contract.transfer(
			"0xcb72b2bb1407137eBD0994099992354fb7116081",
			ethers.utils.parseUnits(amount.toString(), "ether")
		);

		const result = await tx.wait();
	};
}
