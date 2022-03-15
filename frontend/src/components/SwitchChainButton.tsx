import { useDispatch } from "react-redux";
import { getTokenThunk, switchChainThunk } from "../redux/metaMask/thunk";

export default function SwitchChianButton() {
	const dispatch = useDispatch();

	function switchChain() {
		dispatch(switchChainThunk());
		dispatch(getTokenThunk());
	}

	return (
		<button className="stonk-btn" onClick={switchChain}>
			switch to AVAX chain
		</button>
	);
}
