import { Contract, ethers } from "ethers";
import { useEffect } from "react";

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

export default function SwitchChianButton() {
	const provider = new ethers.providers.Web3Provider(window.ethereum);

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
	const contractAddress = "0x6baad065aa5173e16783d35f607265b5b2750264";

	useEffect(() => {
		async function test() {
			await provider.send("eth_requestAccounts", []);
			const contract = new Contract(contractAddress, abi, provider);
			
			const balance = await contract.balanceOf("0xcb72b2bb1407137eBD0994099992354fb7116081");
			const num = ethers.utils.formatEther(balance);
			console.log(num);
			console.log(await provider.getNetwork());
			
		}
		test();
	}, []);

	async function addChain() {
		try {
			await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0xA869" }] });
		} catch (switchError: any) {
			if (switchError.code === 4902) {
				try {
					await window.ethereum.request({
						method: "wallet_addEthereumChain",
						params: [AVALANCHE_TESTNET_PARAMS],
					});
				} catch (addError) {
					console.log(addError);
				}
			} else {
				console.log(switchError);
			}
		}
	}
	return <button onClick={addChain}>switch chain</button>;
}
