import "../css/StockTable.css";
import { Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { Stock } from "../redux/stock/state";
import { Portfolio } from "../redux/portfolio/state";

type Props = {
	headings: string[];
	content: Array<Omit<Stock, "id"> | Omit<Portfolio, "stockId">>;
};

function StockTable({ headings, content: contents }: Props) {
	const dispatch = useDispatch();

	function toStock(e: any, ticker: string) {
		if (e.target.children[0] === undefined) {
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
				{contents.map((content, i) => {
					const values = Object.values(content);
					return (
						<tr key={i} onClick={(e) => toStock(e, content.ticker)}>
							{values.map((value: any, i) => (
								<td key={i}>{value}</td>
							))}
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
}

export default StockTable;
