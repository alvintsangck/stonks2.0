import { useDispatch, useSelector } from "react-redux";
import { getBalanceThunk, switchChainThunk } from "../redux/metaMask/thunk";
import { RootState } from "../redux/store/state";

export default function SwitchChianButton() {
	const dispatch = useDispatch();
	const account = useSelector((state:RootState)=>state.metaMask.account)

	function switchChain() {
		dispatch(switchChainThunk());
		dispatch(getBalanceThunk(account));
	}

	return (
		<button className="stonk-btn" onClick={switchChain}>
			switch to AVAX chain
		</button>
	);
}
