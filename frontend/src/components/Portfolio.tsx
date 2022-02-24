import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import Navbar from "./Navbar";
import { Doughnut } from "react-chartjs-2";

export default function portfolio() {
	// const dispatch = useDispatch();
	// const user = useSelector((state: RootState)=>state.auth);
	return (
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
					<Doughnut
						data={{
							labels: labelsTag,
							datasets: [
								{
									label: "My Top 10 Shares",
									data: dataTag,
									backgroundColor: [
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
										`rgb(${(Math.random() * 255).toFixed()},${(Math.random() * 255).toFixed()},${(
											Math.random() * 255
										).toFixed()})`,
									],
								},
							],
						}}
					/>
					<canvas className="shares-holding" height="100" width="100"></canvas>
				</div>
			</div>
			<div className="row portfolio-detail">
				<div className="portfolio-table col-md-12 col-sm-12 col-xs-12">
					<table className="portfo-table table table-striped table-hover">
						<thead>
							<th>Ticker</th>
							<th>Company Name</th>
							<th>Price(now price)</th>
							<th>Share(s)</th>
							<th>Avg. Unit Cost(sum (share* buy-sell unit cost) / shares)</th>
							<th>Total Cost(share * avg unit cost)</th>
							<th>Market Value(share * now price)</th>
							<th>Profit/Loss(mk v - tt c)</th>
							<th>Profit/Loss%((mk v -tt c) /tt c *100%)</th>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
