import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddForm from "./AddForm";
import "../css/Sidebar.css";
import { useDispatch } from "react-redux";
import { deleteWatchlistThunk, getWatchlistThunk } from "../redux/watchlist/thunk";

type Props = {
	lists: any[];
	currentListId: number | null;
};

function Sidebar({ lists, currentListId }: Props) {
	const dispatch = useDispatch();

	return (
		<>
			<AddForm name="My Lists" placeholder="watchlist" />
			<div className="section">
				{lists.map((list) => (
					<div
						key={list.id}
						className={list.id === currentListId ? "selected" : ""}
						onClick={() => dispatch(getWatchlistThunk(list.id))}
					>
						<div>
							<span>{list.name}</span>
						</div>
						<div>
							<FontAwesomeIcon icon={faTimes} onClick={() => dispatch(deleteWatchlistThunk(list.id))} />
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default Sidebar;
