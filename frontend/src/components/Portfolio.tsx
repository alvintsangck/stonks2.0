import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "../css/Portfolio.css";
import { Table } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartData = {
	labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
	datasets: [
		{
			label: "# of Votes",
			data: [12, 19, 3, 5, 2, 3],
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

export default function Portfolio() {
	// const dispatch = useDispatch();
	// const user = useSelector((state: RootState)=>state.auth);
	// const theme = useSelector((state: RootState) => state.theme.theme);
	return (
		<div>
			<Helmet>
				<title>Portfolio | stonks</title>
			</Helmet>
			<div className="container portfolio-container">
				<div className="row portfolio-brief">
					<div className="col-md-6 account-brief">
						<div className="acco-value brief-info">
							Market Value <span className="account-value brief-value">123</span>
						</div>
						<div className="accu-value brief-info">
							Accumulate Profit/Loss <span className="accumulate-profit brief-value">123</span>
						</div>
						<div className="accu-percent brief-info">
							Accumulate Profit/Loss% <span className="accumulate-percentage brief-value">123</span>
						</div>
					</div>
					<div className="col-md-6">
						<Doughnut data={ChartData} />
						<canvas className="shares-holding" height="100" width="100"></canvas>
					</div>
				</div>
				<div className="row portfolio-detail">
					<div className="portfolio-table col-md-12 col-sm-12 col-xs-12">
						<Table responsive striped hover className="portfo-table table table-striped table-hover">
							<thead>
								<tr>
									<th>Ticker</th>
									<th>Company Name</th>
									<th>Price(now price)</th>
									<th>Share(s)</th>
									<th>Avg. Unit Cost(sum (share* buy-sell unit cost) / shares)</th>
									<th>Total Cost(share * avg unit cost)</th>
									<th>Market Value(share * now price)</th>
									<th>Profit/Loss(mk v - tt c)</th>
									<th>Profit/Loss%((mk v -tt c) /tt c *100%)</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									{Array.from({ length: 9 }).map((_, index) => (
										<td key={index}>Table cell {index}</td>
									))}
								</tr>
								<tr>
									{Array.from({ length: 9 }).map((_, index) => (
										<td key={index}>Table cell {index}</td>
									))}
								</tr>
							</tbody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
