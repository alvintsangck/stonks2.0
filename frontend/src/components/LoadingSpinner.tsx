import "../css/LoadingSpinner.css";
import { RingLoader } from "react-spinners";

export default function LoadingSpinner() {
	return (
		<div className="loading">
			<RingLoader color="#0000AC" />
		</div>
	);
}
