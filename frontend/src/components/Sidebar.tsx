import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddForm from "./AddForm";
import "../css/Sidebar.css";
import { useDispatch } from "react-redux";
import { addWatchlistThunk, deleteWatchlistThunk, getWatchlistThunk } from "../redux/watchlist/thunk";
import { push } from "connected-react-router";

type Props = {
	lists: any[];
	currentListId: number;
};

function Sidebar({ lists, currentListId }: Props) {
	const dispatch = useDispatch();
	const deleteWatchlist = (listId: number) => {
		dispatch(deleteWatchlistThunk(listId));
		if (currentListId === listId) {
			dispatch(push(`/watchlist/${lists[0].id}`));
		}
	};
	return (
		<>
			<AddForm name="My Lists" placeholder="watchlist" onAdd={addWatchlistThunk} />
			<div className="section">
				{lists.map((list) => (
					<div key={list.id} className={list.id === currentListId ? "selected" : ""}>
						<div onClick={() => dispatch(getWatchlistThunk(list.id))}>
							<span>{list.name}</span>
						</div>
						<div>
							<FontAwesomeIcon icon={faTimes} onClick={() => deleteWatchlist(list.id)} />
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default Sidebar;
