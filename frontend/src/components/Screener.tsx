import "../css/Screener.css";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import StockTable from "./StockTable";
import ScreenerForm from "./ScreenerForm";
import ScreenerItem from "./ScreenerItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { resetScreenerAction } from "../redux/screener/action";

export default function Screener() {
	const tableHeadings: string[] = [
		"TICKER",
		"COMPANY NAME",
		"PRICE ($)",
		"CHANGE ($)",
		"CHANGE %",
		"52 WEEKS HIGH ($)",
		"MARKET CAP (MIL)",
		"RS RATING",
		"SECTOR",
		"INDUSTRY",
		"INDUSTRY RS",
		"INDUSTRY RANK",
	];
	const dispatch = useDispatch();
	const stocks = useSelector((state: RootState) => state.screener.stocks);

	return (
		<>
			<Helmet>
				<title>Screener | Stonks</title>
			</Helmet>
			<Container>
				<ScreenerForm />
				<ScreenerItem />
				<Row className="screen-result">
					<Col xs={6}>
						<h4>Number of stocks found:</h4>
					</Col>
					<Col xs={3}>
						<button type="submit" className="screener-btn result-btn" form="screener-form">
							View Screen Results
						</button>
					</Col>
					<Col xs={3}>
						<button className="screener-btn result-btn" onClick={() => dispatch(resetScreenerAction())}>
							Reset
						</button>
					</Col>
				</Row>
			</Container>
			<Container fluid>
				<StockTable headings={tableHeadings} content={stocks} />
			</Container>
		</>
	);
}
