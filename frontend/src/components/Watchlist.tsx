import { Helmet } from "react-helmet";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "./Sidebar";
import AddForm from "./AddForm";
import "../css/Watchlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteStockThunk, getAllWatchlistsThunk, getWatchlistThunk } from "../redux/watchlist/thunk";
import { RootState } from "../redux/store/state";
import StockTable from "./StockTable";

export default function Watchlist() {
	const tableHeadings = ["Ticker", "Company Name", "Price", "Change", "Change %", ""];
	const watchlists = useSelector((state: RootState) => state.watchlist.watchlists);
	const watchlistId = useSelector((state: RootState) => state.watchlist.watchlistId);
	const stocks = useSelector((state: RootState) => state.watchlist.stocks);
	const currentWatchlistName = watchlists.find((watchlist) => watchlist?.id === watchlistId)?.name || "";
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllWatchlistsThunk());
	}, [dispatch]);

	useEffect(() => {
		if (watchlistId && watchlistId > 0) {
			dispatch(getWatchlistThunk(watchlistId));
		}
	}, [dispatch, watchlistId]);

	const deleteStock = (watchlistId: number | null, stockId: number) => {
		if (watchlistId && watchlistId > 0) {
			dispatch(deleteStockThunk(watchlistId, stockId));
		}
	};

	const calculatedStocks = stocks.map((stock) => {
		if (stock) {
			const change = stock.price - stock.prevPrice;
			return {
				ticker: stock.ticker,
				name: stock.name,
				price: stock.price,
				change: change.toFixed(2),
				changePercentage: ((change / stock.prevPrice) * 100).toFixed(2) + "%",
				deleteBtn: <FontAwesomeIcon icon={faTimes} onClick={() => deleteStock(watchlistId, stock.id)} />,
			};
		}
		return null;
	});

	return (
		<>
			<Helmet>
				<title>Watchlist | Stonks</title>
			</Helmet>
			<Container fluid className="watchlist-container">
				<Row>
					<Col md={3}>
						<Sidebar lists={watchlists} currentListId={watchlistId} />
					</Col>
					<Col md={9}>
						<AddForm name={currentWatchlistName} placeholder="stock" />
						<StockTable headings={tableHeadings} content={calculatedStocks} />
					</Col>
				</Row>
			</Container>
		</>
	);
}
