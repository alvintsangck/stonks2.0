import "../css/Portfolio.css";
import { Helmet } from "react-helmet";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { useEffect, useState } from "react";
import { getPortfolioThunk } from "../redux/portfolio/thunk";
import StockTable from "./StockTable";
import { getBalanceThunk } from "../redux/auth/thunk";
import { push } from "connected-react-router";
import { env } from "../env";
import { CalcPortfolio, UserPortfolio } from "../redux/portfolio/state";
import { commaNumber } from "../helper";

ChartJS.register(ArcElement, Tooltip, Legend);

type FinnhubTrade = {
	s: string;
	p: number;
	t: number;
	v: number;
	c: string;
};

export default function Portfolio() {
	const dispatch = useDispatch();
	const portfolio = useSelector((state: RootState) => state.portfolio.portfolio);
	const deposit = useSelector((state: RootState) => state.auth.balance.deposit);
	const cash = useSelector((state: RootState) => state.auth.balance.cash);
	const [trades, setTrades] = useState<FinnhubTrade[]>([]);
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
		labels: portfolio.map((stock) => stock.ticker),
		datasets: [
			{
				label: "number of shares",
				data: portfolio.map((stock) => stock.shares),
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

	useEffect(() => {
		dispatch(getPortfolioThunk());
		dispatch(getBalanceThunk());
	}, [dispatch]);

	useEffect(() => {
		const socket = new WebSocket(`wss://ws.finnhub.io?token=${env.finnhubKey}`);
		if (portfolio.length > 0) {
			socket.addEventListener("open", (e) => {
				for (let stock of portfolio) {
					socket.send(JSON.stringify({ type: "subscribe", symbol: stock.ticker }));
				}
			});

			socket.addEventListener("message", (e) => {
				const data = JSON.parse(e.data);
				if (data.data) {
					const trades = data.data;
					setTrades(trades);
				}
			});
		}
		return () => {
			for (let stock of portfolio) {
				socket.addEventListener("open", () => {
					socket.send(JSON.stringify({ type: "unsubscribe", symbol: stock.ticker }));
				});
			}
			socket.close();
		};
	}, [portfolio]);

	function mapPortfolio(stock: UserPortfolio) {
		const price = trades.find((trade) => trade?.s === stock.ticker);
		if (price) {
			const marketValue = Number(stock.shares) * price.p;
			const profit = marketValue - Number(stock.totalCost);
			return {
				ticker: stock.ticker,
				name: stock.name,
				shares: Number(stock.shares),
				price: price.p,
				avgCost: Number(stock.totalCost) / Number(stock.shares),
				totalCost: stock.totalCost,
				marketValue,
				profit,
			};
		}
		return {
			ticker: stock.ticker,
			name: stock.name,
			price: "calculating",
			shares: Number(stock.shares),
			avgCost: Number(stock.totalCost) / Number(stock.shares),
			totalCost: stock.totalCost,
			marketValue: "calculating",
			profit: "calculating",
		};
	}

	const calcPortfolio: CalcPortfolio[] = portfolio.map(mapPortfolio);
	const profit = calcProfit(calcPortfolio);
	const marketValue = calcPortfolio
		.map((stock) => stock.marketValue)
		.reduce((prev, next) => Number(prev) + Number(next), 0);

	function mapStockTable(stock: CalcPortfolio, i: number) {
		return (
			<tr key={i} onClick={() => dispatch(push(`/stocks/${stock.ticker}`))}>
				<td>{stock.ticker}</td>
				<td>{stock.name}</td>
				<td>{Number.isNaN(stock.price) ? "is calculating" : commaNumber(Number(stock.price))}</td>
				<td>{stock.shares}</td>
				<td>{stock.avgCost.toFixed(2)}</td>
				<td>{stock.totalCost}</td>
				<td>{Number.isNaN(stock.price) ? "is calculating" : commaNumber(Number(stock.marketValue))}</td>
				<td>{Number.isNaN(stock.price) ? "is calculating" : commaNumber(Number(stock.profit))}</td>
				<td>
					{Number.isNaN(stock.price)
						? "is calculating"
						: ((Number(stock.profit) / Number(stock.marketValue)) * 100).toFixed(2) + "%"}
				</td>
			</tr>
		);
	}
	const portfolioTable = calcPortfolio.map(mapStockTable);
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
								{Number.isNaN(marketValue) ? "is calculating" : "$" + commaNumber(Number(marketValue))}
							</span>
						</div>
						<div className="accu-value brief-info">
							Accumulate Profit/Loss
							<span className="accumulate-profit brief-value">
								{Number.isNaN(profit) ? "is calculating" : "$" + profit.toFixed(2)}
							</span>
						</div>
						<div className="accu-percent brief-info">
							Accumulate Profit/Loss%
							<span className="accumulate-percentage brief-value">
								{Number.isNaN(profit) ? "is calculating" : ((profit / deposit) * 100).toFixed(2) + "%"}
							</span>
						</div>
						<div className="accu-percent brief-info">
							Cash BP
							<span className="accumulate-percentage brief-value">{cash}</span>
						</div>
						<div className="button-container">
							<button className="stonk-btn" onClick={() => dispatch(push("/transfer/deposit"))}>
								Deposit
							</button>
							<button className="stonk-btn" onClick={() => dispatch(push("/transfer/withdrawal"))}>
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
						calcPortfolio.length > 0 ? (
							portfolioTable
						) : (
							<tr className="loading-container">
								<td className=" empty">Your table is empty</td>
							</tr>
						)
					}
					isLoading={false}
				/>
			</Container>
		</>
	);
}

function calcProfit(portfolio: CalcPortfolio[]): number {
	let profit = 0;
	for (let stock of portfolio) {
		if (!Number.isNaN(stock.profit)) {
			profit += Number(stock.profit);
		}
	}
	return profit;
}
