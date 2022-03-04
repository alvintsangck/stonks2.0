import "../css/Screener.css";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import StockTable from "./StockTable";
import ScreenerForm from "./ScreenerForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";

export default function Screener() {
	const tableHeadings: string[] = [
		"NUMBER",
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
			</Container>
			<Container fluid>
				<StockTable headings={tableHeadings} content={stocks} />
			</Container>
		</>
	);
}
