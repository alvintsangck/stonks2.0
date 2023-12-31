import { useDispatch } from "react-redux";
import { switchChainThunk } from "../../redux/metaMask/thunk";

export default function SwitchChianButton() {
  const dispatch = useDispatch();

  function switchChain() {
    dispatch(switchChainThunk() as any);
  }

  return (
    <button className="stonk-btn" onClick={switchChain}>
      switch
    </button>
  );
}
