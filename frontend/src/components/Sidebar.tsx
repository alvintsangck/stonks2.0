import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddForm from "./AddForm";
import "../css/Sidebar.css";
import { useDispatch } from "react-redux";
import { addWatchlistThunk, deleteWatchlistThunk, getWatchlistThunk } from "../redux/watchlist/thunk";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useNavigate } from "react-router-dom";

type Props = {
	lists: any[];
	currentListId: number;
};

function Sidebar({ lists, currentListId }: Props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const deleteWatchlist = (listId: number, name: string) => {
		dispatch(deleteWatchlistThunk(listId, name));
		if (currentListId === listId) {
			navigate(`/watchlist/${lists[0].id}`);
		}
	};

	return (
		<>
			<AddForm name="My Lists" placeholder="watchlist" onAdd={addWatchlistThunk} />
			<div className="section">
				{lists.length > 0 &&
					lists.map((list) => (
						<div key={list.id} className={list.id === currentListId ? "selected" : ""}>
							<div onClick={() => dispatch(getWatchlistThunk(list.id))}>
								<span>{list.name}</span>
							</div>
							<div>
								<FontAwesomeIcon
									icon={faTimes as IconProp}
									onClick={() => deleteWatchlist(list.id, list.name)}
								/>
							</div>
						</div>
					))}
			</div>
		</>
	);
}

export default Sidebar;
