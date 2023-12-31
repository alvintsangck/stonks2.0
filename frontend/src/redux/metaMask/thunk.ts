import { Contract, ethers, Wallet } from "ethers";
import { UseFormReset } from "react-hook-form";
import { DepositFormState } from "../../components/transfer/DepositForm";
import { WithdrawalFormState } from "../../components/transfer/WithdrawalForm";
import { env } from "../../util/env";
import { defaultSuccessSwal } from "../../util/ReactSwal";
import { callApi } from "../api";
import { getCash } from "../auth/slice";
import abi from "./abi";
import { getChainId, getMetaMask, getToken } from "./slice";

const ethereum = window.ethereum;

export function getMetaMaskThunk() {
  return async (dispatch: any) => {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      dispatch(getMetaMask(accounts[0]));
    } catch (error: any) {
      // dispatch(apiFailedAction(error.message));
    }
  };
}

export function getChainIdThunk() {
  return async (dispatch: any) => {
    try {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      dispatch(getChainId(parseInt(chainId, 16)));
    } catch (error: any) {
      // dispatch(apiFailedAction(error.message));
    }
  };
}

export function switchChainThunk() {
  return async (dispatch: any) => {
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
      dispatch(getChainId(43113));
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [AVALANCHE_TESTNET_PARAMS],
          });
          dispatch(getChainId(43113));
        } catch (addError: any) {
          // dispatch(apiFailedAction(addError.message));
        }
      } else {
        // dispatch(apiFailedAction(switchError.message));
      }
    }
  };
}

export function getTokenThunk() {
  return async (dispatch: any) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0x6baad065aa5173e16783d35f607265b5b2750264";
    const contract = new Contract(contractAddress, abi, provider);
    try {
      const balance = await contract.balanceOf(await signer.getAddress());
      const calculatedBalance = ethers.utils.formatEther(balance);
      dispatch(getToken(Number(calculatedBalance)));
    } catch (error: any) {
      //   dispatch(apiFailedAction(error.message));
    }
  };
}

export function depositThunk(cash: number, reset: UseFormReset<DepositFormState>) {
  return async (dispatch: any) => {
    // dispatch(loadingMetaMaskAction());
    const account = env.metaMask;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0x6baad065aa5173e16783d35f607265b5b2750264";
    const contract = new Contract(contractAddress, abi, signer);
    const calcAmount = ethers.utils.parseUnits(cash.toString(), "ether");

    try {
      const preTxn = await contract.callStatic.transfer(account, calcAmount);
      if (preTxn) {
        const tx = await contract.transfer(account, calcAmount);
        const result = await tx.wait();
        if (result.status === 1) {
          const result = await callApi(`/user/deposit`, "POST", { cash });
          if ("error" in result) {
            // dispatch(apiFailedAction(result.error));
          } else {
            reset();
            const balance = await contract.balanceOf(await signer.getAddress());
            const calculatedBalance = ethers.utils.formatEther(balance);
            dispatch(getToken(Number(calculatedBalance)));
            dispatch(getCash(result.cash));
            defaultSuccessSwal("Deposit successful");
          }
        }
      } else {
        // dispatch(apiFailedAction("Deposit failed. Please try again"));
      }
    } catch (error: any) {
      if (error.code === 4001) {
        // dispatch(apiFailedAction("Transaction denied"));
      } else {
        console.log(error);
      }
    }
    // dispatch(endLoadingMetaMaskAction());
  };
}

export function withdrawalThunk(account: string, cash: string, reset: UseFormReset<WithdrawalFormState>) {
  return async (dispatch: any) => {
    // dispatch(loadingMetaMaskAction());
    const nodeUrl = "https://api.avax-test.network/ext/bc/C/rpc";
    const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
    const wallet = new Wallet(env.privateKey, provider);
    const contract = new Contract("0x6baad065aa5173e16783d35f607265b5b2750264", abi, wallet);
    const calcAmount = ethers.utils.parseUnits(cash.toString(), "ether");

    try {
      const preTxn = await contract.callStatic.transfer(account, calcAmount);
      if (preTxn) {
        const tx = await contract.transfer(account, calcAmount);
        const result = await tx.wait();
        if (result.status === 1) {
          const result = await callApi(`/user/withdrawal`, "POST", { cash });
          if ("error" in result) {
            // dispatch(apiFailedAction(result.error));
          } else {
            reset();

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const balance = await contract.balanceOf(await signer.getAddress());
            const calculatedBalance = ethers.utils.formatEther(balance);
            dispatch(getToken(Number(calculatedBalance)));

            dispatch(getCash(result.cash));
            defaultSuccessSwal(`Withdraw successful`);
          }
        }
      } else {
        // dispatch(apiFailedAction("Withdraw failed. Please try again"));
      }
    } catch (error: any) {
      if (error.code === 4001) {
        // dispatch(apiFailedAction("Transaction denied"));
      }
    }
    // dispatch(endLoadingMetaMaskAction());
  };
}
