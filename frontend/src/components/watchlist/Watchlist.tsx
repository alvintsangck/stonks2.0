import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Watchlist.css";
import {
  useAddStockMutation,
  useDeleteStockMutation,
  useGetWatchlistsQuery,
  useLazyGetWatchlistByIdQuery,
} from "../../redux/watchlist/api";
import AddForm from "../AddForm";
import StockTable from "../stock/StockTable";
import Sidebar from "./Sidebar";

export default function Watchlist() {
  const navigate = useNavigate();
  const { data: watchlists } = useGetWatchlistsQuery();
  const currentWatchlistId = Number(useParams<{ watchlistId: string }>().watchlistId ?? 0);
  const currentWatchlistName = watchlists?.find((watchlist) => watchlist.id === Number(currentWatchlistId))?.name || "";
  const [getStocks, { data: stocks }] = useLazyGetWatchlistByIdQuery();
  const tableHeadings = ["Ticker", "Company Name", "Price", "Change", "Change %", ""];
  const [addStock] = useAddStockMutation();
  const [deleteStock] = useDeleteStockMutation();

  useEffect(() => {
    if (currentWatchlistId > 0) {
      getStocks(currentWatchlistId);
    }
  }, [currentWatchlistId, getStocks]);

  useEffect(() => {
    if (currentWatchlistId <= 0 && watchlists && watchlists.length > 0) {
      navigate(`/watchlist/${watchlists[0].id}`);
    }
  }, [currentWatchlistId, navigate, watchlists]);

  useEffect(() => {
    if (watchlists && watchlists.length === 1 && currentWatchlistId !== watchlists[0].id) {
      navigate(`/watchlist/${watchlists[0].id}`);
    }
  }, [navigate, watchlists, currentWatchlistId]);

  const watchlistTable = stocks?.map((stock, i: number) => {
    const change = stock.price - stock.prevPrice!;
    return (
      <tr key={i}>
        <td onClick={() => navigate(`/stocks/${stock.ticker}`)}>{stock.ticker}</td>
        <td onClick={() => navigate(`/stocks/${stock.ticker}`)}>{stock.name}</td>
        <td onClick={() => navigate(`/stocks/${stock.ticker}`)}>{Number(stock.price).toFixed(2)}</td>
        <td onClick={() => navigate(`/stocks/${stock.ticker}`)}>{change.toFixed(2)}</td>
        <td onClick={() => navigate(`/stocks/${stock.ticker}`)}>
          {((change / stock.prevPrice!) * 100).toFixed(2) + "%"}
        </td>
        <td>
          <FontAwesomeIcon
            icon={faTimes as IconProp}
            onClick={async () => {
              deleteStock({ watchlistId: currentWatchlistId, stockId: stock.id });
            }}
          />
        </td>
      </tr>
    );
  });

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
            <AddForm
              name={currentWatchlistName}
              placeholder="stock"
              onAdd={async (ticker: string) => {
                addStock({ watchlistId: currentWatchlistId, ticker: ticker.toUpperCase() });
              }}
            />
            <StockTable headings={tableHeadings} contents={watchlistTable} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
