import { useDispatch } from "react-redux";
import { getBalanceThunk, switchChainThunk } from "../redux/metaMask/thunk";

export default function SwitchChianButton() {
	const dispatch = useDispatch();

	function switchChain() {
		dispatch(switchChainThunk());
		dispatch(getBalanceThunk());
	}

	return (
		<button className="stonk-btn" onClick={switchChain}>
			switch to AVAX chain
		</button>
	);
}
