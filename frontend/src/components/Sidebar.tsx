import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddForm from "./AddForm";
import "../css/Sidebar.css";

function Sidebar() {
	return (
		<>
			<AddForm name="My Lists" placeholder="watchlist" />
			<div className="section">
				<div>
					<div>
						<span>1</span>
					</div>
					<div>
						<FontAwesomeIcon icon={faTimes} />
					</div>
				</div>
			</div>
		</>
	);
}

export default Sidebar;
