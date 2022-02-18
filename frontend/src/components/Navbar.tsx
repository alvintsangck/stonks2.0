import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";

export default function Navbar() {
	const dispatch = useDispatch()
	const user = useSelector((state:RootState)=>state.auth)

	
	return <nav>NavBar</nav>;
}
