import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import StockTable from "./StockTable";
import ScreenerForm from "./ScreenerForm";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import LoadingSpinner from "./LoadingSpinner";

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
	const stocks = useSelector((state: RootState) => state.screener.stocks);
	const isLoading = useSelector((state: RootState) => state.screener.isLoading);
	console.log(stocks);
	
	return (
		<>
			<Helmet>
				<title>Screener | Stonks</title>
			</Helmet>
			<Container>
				<ScreenerForm />
			</Container>
			<Container fluid>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<StockTable headings={tableHeadings} content={stocks.map(({ id, ...obj }) => obj)} />
				)}
			</Container>
		</>
	);
}
