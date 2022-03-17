import "../css/Portfolio.css";
import { Helmet } from "react-helmet";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { useEffect } from "react";
import { getPortfolioPriceThunk, getPortfolioThunk } from "../redux/portfolio/thunk";
import StockTable from "./StockTable";
import { getBalanceThunk } from "../redux/auth/thunk";
import { push } from "connected-react-router";
import { env } from "../env";
import { CalcPortfolio, UserPortfolio } from "../redux/portfolio/state";
import { commaNumber } from "../helper";
import { getPortfolioPriceAction } from "../redux/portfolio/action";

ChartJS.register(ArcElement, Tooltip, Legend);

export type FinnhubTrade = {
	s: string;
	p: number;
	t?: number;
	v?: number;
	c?: string;
};

export default function Portfolio() {
	const dispatch = useDispatch();
	const portfolio = useSelector((state: RootState) => state.portfolio.portfolio);
	const deposit = useSelector((state: RootState) => state.auth.balance.deposit);
	const cash = useSelector((state: RootState) => state.auth.balance.cash);
	const priceArr = useSelector((state: RootState) => state.portfolio.price);
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
		dispatch(getPortfolioPriceThunk(portfolio));
	}, [dispatch, portfolio]);

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
					dispatch(getPortfolioPriceAction(trades));
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
	}, [dispatch, portfolio]);

	function mapPortfolio(stocks: UserPortfolio[]) {
		let arr = [];
		for (let i = 0; i < stocks.length; i++) {
			const price = priceArr.find((stock) => stock?.s === stocks[i].ticker);
			if (price) {
				const marketValue = Number(stocks[i].shares) * price.p;
				const profit = marketValue - Number(stocks[i].totalCost);
				arr.push({
					ticker: stocks[i].ticker,
					name: stocks[i].name,
					shares: Number(stocks[i].shares),
					price: price.p,
					avgCost: Number(stocks[i].totalCost) / Number(stocks[i].shares),
					totalCost: stocks[i].totalCost,
					marketValue,
					profit,
				});
			} else {
				arr.push({
					ticker: stocks[i].ticker,
					name: stocks[i].name,
					price: prevCalcPortfolio ? prevCalcPortfolio[i].price : null,
					shares: Number(stocks[i].shares),
					avgCost: Number(stocks[i].totalCost) / Number(stocks[i].shares),
					totalCost: stocks[i].totalCost,
					marketValue: prevCalcPortfolio ? prevCalcPortfolio[i].marketValue : null,
					profit: prevCalcPortfolio ? prevCalcPortfolio[i].profit : null,
				});
			}
		}
		return arr;
	}
	let prevCalcPortfolio: CalcPortfolio[];
	const calcPortfolio: CalcPortfolio[] = mapPortfolio(portfolio);
	prevCalcPortfolio = calcPortfolio;
	const profit = calcPortfolio.map((stock) => stock.profit).reduce((prev, next) => Number(prev) + Number(next), 0);
	const marketValue = calcPortfolio
		.map((stock) => stock.marketValue)
		.reduce((prev, next) => Number(prev) + Number(next), 0);

	function mapPortfolioTable(stock: CalcPortfolio, i: number) {
		const { price, profit, marketValue, ticker, name, shares, avgCost, totalCost } = stock;
		const profitPercent = (Number(stock.profit) / Number(marketValue)) * 100;
		const isPriceZero = Number.isNaN(Number(price));

		return (
			<tr key={i} onClick={() => dispatch(push(`/stocks/${ticker}`))}>
				<td>{ticker}</td>
				<td>{name}</td>
				<td>{isPriceZero ? "calculating" : commaNumber(Number(price))}</td>
				<td>{shares}</td>
				<td>{avgCost.toFixed(2)}</td>
				<td>{totalCost.toFixed(2)}</td>
				<td>{isPriceZero ? "calculating" : commaNumber(Number(marketValue))}</td>
				<td className={!isPriceZero && Number(profit) > 0 ? "positive" : Number(profit) < 0 ? "negative" : ""}>
					{isPriceZero ? "calculating" : commaNumber(Number(profit))}
				</td>
				<td className={!isPriceZero && profitPercent > 0 ? "positive" : profitPercent < 0 ? "negative" : ""}>
					{isPriceZero ? "calculating" : profitPercent.toFixed(2) + "%"}
				</td>
			</tr>
		);
	}
	const portfolioTable = calcPortfolio.map(mapPortfolioTable);
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
								{Number.isNaN(profit)
									? "calculating"
									: ((Number(profit) / deposit) * 100).toFixed(2) + "%"}
							</span>
						</div>
						<div className="accu-percent brief-info">
							Cash
							<span className="accumulate-percentage brief-value">{"$" + commaNumber(cash)}</span>
						</div>
						<div className="accu-percent brief-info">
							Total Account Value
							<span className="accumulate-percentage brief-value">
								{"$" + commaNumber(cash + Number(marketValue))}
							</span>
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
