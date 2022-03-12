import { Helmet } from "react-helmet";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "./Sidebar";
import AddForm from "./AddForm";
import "../css/Watchlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { addStockThunk, deleteStockThunk, getAllWatchlistsThunk, getWatchlistThunk } from "../redux/watchlist/thunk";
import { RootState } from "../redux/store/state";
import StockTable from "./StockTable";
import { useParams } from "react-router-dom";
import { Stock } from "../redux/stock/state";
import LoadingSpinner from "./LoadingSpinner";

export default function Watchlist() {
	const dispatch = useDispatch();
	const watchlists = useSelector((state: RootState) => state.watchlist.watchlists);
	const stocks = useSelector((state: RootState) => state.watchlist.stocks);
	const isLoading = useSelector((state: RootState) => state.watchlist.isLoading);
	const currentWatchlistId: number = Number(useParams<{ watchlistId: string }>().watchlistId);
	const currentWatchlistName = watchlists.find((watchlist) => watchlist.id === currentWatchlistId)?.name || "";
	const tableHeadings = ["Ticker", "Company Name", "Price", "Change", "Change %", ""];

	useEffect(() => {
		dispatch(getAllWatchlistsThunk());
	}, [dispatch]);

	useEffect(() => {
		if (watchlists.length > 0) {
			if (Number.isNaN(currentWatchlistId)) {
				dispatch(getWatchlistThunk(watchlists[0].id));
			} else {
				dispatch(getWatchlistThunk(currentWatchlistId));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, watchlists]);

	const addStock = (ticker: string) => {
		return addStockThunk(currentWatchlistId, ticker);
	};

	const calculatedStocks = useMemo(
		() => loadStocks(stocks, currentWatchlistId, currentWatchlistName, dispatch),
		[currentWatchlistId, currentWatchlistName, dispatch, stocks]
	);

	return (
		<>
			<Helmet>
				<title>Watchlist | Stonks</title>
			</Helmet>
			<Container fluid className="watchlist-container">
				<Row>
					<Col md={3}>
						<Sidebar lists={watchlists} currentListId={currentWatchlistId} />
					</Col>
					<Col md={9}>
						<AddForm name={currentWatchlistName} placeholder="stock" onAdd={addStock} />

						{isLoading ? (
							<LoadingSpinner />
						) : (
							<StockTable headings={tableHeadings} content={calculatedStocks} />
						)}
					</Col>
				</Row>
			</Container>
		</>
	);
}

function loadStocks(stocks: Stock[], watchlistId: number, watchlistName: string, dispatch: Function) {
	return stocks.map((stock) => {
		if (stock) {
			const deleteInfo = {
				watchlistId,
				stockId: stock.id,
				ticker: stock.ticker,
				watchlistName,
			};
			//load into table
			const change = stock.price - stock.prevPrice!;
			return {
				id: stock.id,
				ticker: stock.ticker,
				name: stock.name,
				price: stock.price,
				change: change.toFixed(2),
				changePercentage: ((change / stock.prevPrice!) * 100).toFixed(2) + "%",
				deleteBtn: <FontAwesomeIcon icon={faTimes} onClick={() => dispatch(deleteStockThunk(deleteInfo))} />,
			};
		}
		return null;
	});
}
