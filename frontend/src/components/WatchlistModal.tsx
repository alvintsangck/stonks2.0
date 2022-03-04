import "../css/WatchlistModal.css";
import { useEffect, useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState } from "../redux/store/state";
import { addStockThunk, getAllWatchlistsThunk } from "../redux/watchlist/thunk";

type Props = {
	isShow: boolean;
	setIsShow: (isShow: boolean) => void;
};

export default function WatchlistModal({ isShow, setIsShow }: Props) {
	const watchlists = useSelector((state: RootState) => state.watchlist.watchlists);
	const [watchlistId, setWatchlistId] = useState(0);
	const { ticker } = useParams<{ ticker: string }>();
	const dispatch = useDispatch();

	const hideModal = () => setIsShow(false);

	const addStock = () => {
		dispatch(addStockThunk(watchlistId, ticker));
		setWatchlistId(0);
		setIsShow(false);
	};

	useEffect(() => {
		dispatch(getAllWatchlistsThunk());
	}, []);

	return (
		<Modal show={isShow} onHide={hideModal} centered>
			<Modal.Header closeButton>
				<Modal.Title>Add to Watchlist</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ListGroup>
					{watchlists.map(({ id, name }) => (
						<ListGroup.Item
							className={watchlistId === id ? "active" : ""}
							onClick={() => setWatchlistId(id)}
							key={id}
						>
							{name}
						</ListGroup.Item>
					))}
				</ListGroup>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={hideModal}>
					Close
				</Button>
				<Button variant="primary" onClick={addStock}>
					Add
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
