export const getMetaMaskAction = (account: string) => ({
	type: "@@MetaMask/getAccount" as const,
	account,
});

export const getChainIdAction = (chainId: number) => ({
	type: "@@MetaMask/getChainId" as const,
	chainId,
});

export const getBalanceAction = (balance: number) => ({
	type: "@@MetaMask/getBalance" as const,
	balance,
});

export const apiFailedAction = (error: string) => ({
	type: "@@MetaMask/apiFailed" as const,
	error,
});

export type MetaMaskAction =
	| ReturnType<typeof getMetaMaskAction>
	| ReturnType<typeof getChainIdAction>
	| ReturnType<typeof getBalanceAction>
	| ReturnType<typeof apiFailedAction>;
