import { MetaMaskAction } from "./action";
import { MetaMaskState } from "./state";

const initialState: MetaMaskState = {
	account: "",
	chainId: 0,
	balance: 0,
	error: "",
};

export function metaMaskReducer(state: MetaMaskState = initialState, action: MetaMaskAction) {
	switch (action.type) {
		case "@@MetaMask/getAccount":
			return { ...state, account: action.account, error: "" };
		case "@@MetaMask/getChainId":
			return { ...state, chainId: action.chainId, error: "" };
		case "@@MetaMask/getBalance":
			return { ...state, balance: action.balance, error: "" };
		case "@@MetaMask/apiFailed":
			return { ...state, error: action.error };
		default:
			return state;
	}
}
