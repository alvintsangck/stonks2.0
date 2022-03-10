import { ethers, Contract } from "ethers";
import { defaultErrorSwal } from "../../components/ReactSwal";
import { RootDispatch } from "../store/action";
import { getBalanceAction, getChainIdAction, getMetaMaskAction } from "./action";

const abi = [
	{
		constant: true,
		inputs: [],
		name: "name",
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				name: "_spender",
				type: "address",
			},
			{
				name: "_value",
				type: "uint256",
			},
		],
		name: "approve",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "totalSupply",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				name: "_from",
				type: "address",
			},
			{
				name: "_to",
				type: "address",
			},
			{
				name: "_value",
				type: "uint256",
			},
		],
		name: "transferFrom",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "decimals",
		outputs: [
			{
				name: "",
				type: "uint8",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "_owner",
				type: "address",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				name: "balance",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "symbol",
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				name: "_to",
				type: "address",
			},
			{
				name: "_value",
				type: "uint256",
			},
		],
		name: "transfer",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "_owner",
				type: "address",
			},
			{
				name: "_spender",
				type: "address",
			},
		],
		name: "allowance",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		payable: true,
		stateMutability: "payable",
		type: "fallback",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				name: "spender",
				type: "address",
			},
			{
				indexed: false,
				name: "value",
				type: "uint256",
			},
		],
		name: "Approval",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				name: "value",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
];
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

export function getBalanceThunk(account: string) {
	return async (dispatch: RootDispatch) => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const contractAddress = "0x6baad065aa5173e16783d35f607265b5b2750264";
		const contract = new Contract(contractAddress, abi, provider);
		try {
			const balance = await contract.balanceOf(account);
			const calculatedBalance = ethers.utils.formatEther(balance);
			dispatch(getBalanceAction(Number(calculatedBalance)));
		} catch (error) {
			console.log(error);
		}
	};
}
