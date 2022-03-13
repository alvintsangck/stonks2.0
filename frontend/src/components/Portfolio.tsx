import "../css/Portfolio.css";
import { Helmet } from "react-helmet";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { useEffect, useMemo } from "react";
import { getPortfolioThunk } from "../redux/portfolio/thunk";
import StockTable from "./StockTable";
import { getBalanceThunk } from "../redux/auth/thunk";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Portfolio() {
	const dispatch = useDispatch();
	const portfolio = useSelector((state: RootState) => state.portfolio.portfolio);
	const deposit = useSelector((state: RootState) => state.auth.balance.deposit);
	const tableHeadings = [
		"ticker",
		"company name",
		"price",
		"share(s)",
		"unit cost",
		"total cost",
		"market value",
		"profit/loss",
		"profit/loss%",
	];
	const ChartData = {
		labels: portfolio.map((stock) => stock.name),
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

	const profit = useMemo(
		() =>
			portfolio.map((stock) => stock.marketValue).reduce((prev, next) => Number(prev) + Number(next), 0) -
			Number(deposit),
		[portfolio, deposit]
	);

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
								$
								{portfolio.length > 0
									? portfolio
											.map((stock) => stock.marketValue)
											.reduce((prev, next) => Number(prev) + Number(next), 0)
									: 0}
							</span>
						</div>
						<div className="accu-value brief-info">
							Accumulate Profit/Loss
							<span className="accumulate-profit brief-value">
								${portfolio.length > 0 ? profit.toFixed(2) : 0}
							</span>
						</div>
						<div className="accu-percent brief-info">
							Accumulate Profit/Loss%
							<span className="accumulate-percentage brief-value">
								{portfolio.length > 0 ? ((profit / deposit) * 100).toFixed(2) + "%" : 0}
							</span>
						</div>
					</Col>
					<Col md={6}>
						<Doughnut data={ChartData} />
						<canvas className="shares-holding" height="100" width="100"></canvas>
					</Col>
				</Row>
				<StockTable headings={tableHeadings} content={portfolio.map(({ stockId, ...obj }) => obj)} />
			</Container>
		</>
	);
}
