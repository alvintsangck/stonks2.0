import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import StockTable from "./StockTable";
import ScreenerForm from "./ScreenerForm";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/state";

export default function Screener() {
	const tableHeadings: string[] = [
		"TICKER",
		"COMPANY",
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

	return (
		<>
			<Helmet>
				<title>Screener | Stonks</title>
			</Helmet>
			<Container>
				<ScreenerForm />
			</Container>
			<Container fluid>
				<StockTable
					headings={tableHeadings}
					contents={stocks.map(({ id, ...obj }) => obj)}
					isLoading={isLoading}
				/>
			</Container>
		</>
	);
}
