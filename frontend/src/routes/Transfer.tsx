import MetaMaskOnboarding from "@metamask/onboarding";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TransferForm from "../components/transfer/TransferForm";
import "../css/Transfer.css";
import { getMetaMask, getChainId } from "../redux/metaMask/slice";
import { getChainIdThunk, getTokenThunk } from "../redux/metaMask/thunk";
import { RootState } from "../redux/store/state";

export default function Transfer() {
  const dispatch = useDispatch();
  const account = useSelector((state: RootState) => state.metaMask.account);
  const chainId = useSelector((state: RootState) => state.metaMask.chainId);
  let { method } = useParams<{ method: string }>();
  method = method ? method : "";

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const ethereum = window.ethereum;

      const handleNewAccount = (newAccount: string[]) => {
        getMetaMask(newAccount[0]);
      };
      const handleChainChanged = (chainId: string) => {
        getChainId(parseInt(chainId, 16));
      };

      ethereum.on("accountsChanged", handleNewAccount);
      ethereum.on("chainChanged", handleChainChanged);
      return () => {
        ethereum.removeListener("accountsChanged", handleNewAccount);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [dispatch]);

  useEffect(() => {
    if (account) {
      dispatch(getChainIdThunk() as any);
    }
  }, [dispatch, account, chainId]);

  useEffect(() => {
    if (chainId === 43113) {
      dispatch(getTokenThunk() as any);
    }
  }, [dispatch, chainId]);

  return (
    <>
      <Helmet>
        <title>{method[0].toUpperCase() + method.substring(1, method.length)} | Stonks</title>
      </Helmet>
      <TransferForm />
    </>
  );
}
