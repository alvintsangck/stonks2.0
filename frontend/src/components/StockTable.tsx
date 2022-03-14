import "../css/StockTable.css";
import { Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { Stock } from "../redux/stock/state";
import { Portfolio } from "../redux/portfolio/state";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
	headings: string[];
	contents: Array<Omit<Stock, "id"> | Omit<Portfolio, "stockId">>;
	isLoading: boolean;
};

function StockTable({ headings, contents, isLoading }: Props) {
	const dispatch = useDispatch();
	function toStock(e: any, ticker: string) {
		if (e.target.children[0] === undefined && e.target.tagName === "TD") {
			dispatch(push(`/stocks/${ticker}`));
		}
	}

	return (
		<Table responsive hover className="stock-table">
			<thead>
				<tr>
					{headings.map((heading) => (
						<th key={heading}>{heading}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{isLoading ? (
					<div className="loading-container">
						<LoadingSpinner />
					</div>
				) : contents.length > 0 ? (
					contents.map((content, i) => {
						const values = Object.values(content);
						return (
							<tr key={i} onClick={(e) => toStock(e, content.ticker)}>
								{values.map((value: any, i) => (
									<td key={i}>{value}</td>
								))}
							</tr>
						);
					})
				) : (
					<tr className="loading-container">
						<td className=" empty">Your table is empty</td>
					</tr>
				)}
			</tbody>
		</Table>
	);
}

export default StockTable;
