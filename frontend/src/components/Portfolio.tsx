import "../css/Portfolio.css";
import { Helmet } from "react-helmet";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useMemo } from "react";
import StockTable from "./stock/StockTable";
import { env } from "../env";
import { UserPortfolio } from "../redux/portfolio/state";
import { commaNumber } from "../helper";
import { useNavigate } from "react-router-dom";
import { useGetBalanceQuery } from "../redux/auth/api";
import { updatePortfolioPrice } from "../redux/portfolio/slice";
import { useAppDispatch, useAppSelector } from "../hook/hooks";
import { useGetPortfolioQuery } from "../redux/portfolio/api";

export default function Portfolio() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state) => state.portfolio.portfolio);
  const { data: balance } = useGetBalanceQuery();
  const cash = balance?.cash ?? 0;
  const deposit = balance?.deposit ?? 0;
  useGetPortfolioQuery();

  const tableHeadings = [
    "ticker",
    "company",
    "price",
    "share(s)",
    "unit cost",
    "total cost",
    "market value",
    "profit/loss",
    "profit/loss%",
  ];
  const ChartData = {
    labels: portfolio?.map((stock) => stock.ticker),
    datasets: [
      {
        label: "number of shares",
        data: portfolio?.map((stock) => stock.shares),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  let socket = useMemo(() => new WebSocket(`wss://ws.finnhub.io?token=${env.finnhubKey}`), []);

  useEffect(() => {
    if (portfolio) {
      socket.addEventListener("open", (e) => {
        for (let stock of portfolio) {
          if (stock.sectorName.toLowerCase() === "crypto".toLowerCase()) {
            socket.send(JSON.stringify({ type: "subscribe", symbol: `BINANCE:${stock.ticker}USDT` }));
          } else {
            socket.send(JSON.stringify({ type: "subscribe", symbol: stock.ticker }));
          }
        }
      });

      socket.addEventListener("message", (e) => {
        const data = JSON.parse(e.data);
        if (data.data) {
          const trades = data.data;
          dispatch(updatePortfolioPrice(trades));
        }
      });

      socket.addEventListener("error", (e) => {});
    }

    return () => {
      if (portfolio) {
        for (let stock of portfolio) {
          socket.addEventListener("open", () => {
            if (stock?.sectorName?.toLowerCase() === "crypto".toLowerCase()) {
              socket.send(JSON.stringify({ type: "unsubscribe", symbol: `BINANCE:${stock.ticker}USDT` }));
            } else {
              socket.send(JSON.stringify({ type: "unsubscribe", symbol: stock.ticker }));
            }
          });
        }
        if (socket.CONNECTING) {
          socket.close();
        }
      }
    };
  }, [dispatch, portfolio, socket]);

  const profit = portfolio?.map((stock) => stock.profit).reduce((prev, next) => Number(prev) + Number(next), 0);
  const marketValue = portfolio
    ?.map((stock) => stock.marketValue)
    .reduce((prev, next) => Number(prev) + Number(next), 0);

  function mapPortfolioTable(stock: UserPortfolio, i: number) {
    const { price, profit, marketValue, ticker, name, shares, unitCost, totalCost } = stock;
    const profitPercent = (Number(stock.profit) / Number(marketValue)) * 100;
    const isPriceZero = Number(price) === 0;

    return (
      <tr key={i} onClick={() => navigate(`/stocks/${ticker}`)}>
        <td>{ticker}</td>
        <td>{name}</td>
        <td>{isPriceZero ? "calculating" : commaNumber(Number(price))}</td>
        <td>{shares}</td>
        <td>{unitCost.toFixed(2)}</td>
        <td>{totalCost.toFixed(2)}</td>
        <td>{isPriceZero ? "calculating" : commaNumber(Number(marketValue))}</td>
        <td className={""}>{isPriceZero ? "calculating" : commaNumber(Number(profit))}</td>
        <td className={""}>{isPriceZero ? "calculating" : profitPercent.toFixed(2) + "%"}</td>
      </tr>
    );
  }
  const portfolioTable = portfolio?.map(mapPortfolioTable);
  return (
    <>
      <Helmet>
        <title>Portfolio | Stonks</title>
      </Helmet>
      <Container className="portfolio-container">
        <Row className="portfolio-brief">
          <Col md={6} className="account-brief">
            <div className="brief-info">
              Market Value
              <span className="account-value brief-value">
                {Number.isNaN(marketValue) ? "calculating" : "$" + commaNumber(Number(marketValue))}
              </span>
            </div>
            <div className="accu-value brief-info">
              Accumulate Profit/Loss
              <span className="accumulate-profit brief-value">
                {Number.isNaN(profit) ? "calculating" : "$" + Number(profit).toFixed(2)}
              </span>
            </div>
            <div className="accu-percent brief-info">
              Accumulate Profit/Loss%
              <span className="accumulate-percentage brief-value">
                {Number.isNaN(profit) ? "calculating" : ((Number(profit) / deposit) * 100).toFixed(2) + "%"}
              </span>
            </div>
            <div className="accu-percent brief-info">
              Cash
              <span className="accumulate-percentage brief-value">{"$" + commaNumber(cash)}</span>
            </div>
            <div className="button-container">
              <button className="stonk-btn" onClick={() => navigate("/transfer/deposit")}>
                Deposit
              </button>
              <button className="stonk-btn" onClick={() => navigate("/transfer/withdrawal")}>
                Withdraw
              </button>
            </div>
          </Col>
          <Col md={6}>
            <Doughnut data={ChartData} />
            <canvas className="shares-holding" height="100" width="100"></canvas>
          </Col>
        </Row>
        <StockTable
          headings={tableHeadings}
          contents={
            portfolioTable ? (
              portfolioTable
            ) : (
              <tr className="loading-container">
                <td className=" empty">Your table is empty</td>
              </tr>
            )
          }
        />
      </Container>
    </>
  );
}
