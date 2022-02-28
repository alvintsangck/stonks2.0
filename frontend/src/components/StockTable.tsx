import { Table } from "react-bootstrap";
import "../css/StockTable.css";

function StockTable() {
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
	return (
		<Table responsive hover className="stock-table">
			<thead>
				<tr>
					{tableHeadings.map((heading) => (
						<th key={heading}>{heading}</th>
					))}
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
				<tr>
					<td>AAPL</td>
					<td>Apple .inc</td>
					<td>150.00</td>
					<td>-10.00</td>
					<td>-6.25</td>
					<td>183.00</td>
					<td>260432.4</td>
					<td>65</td>
					<td>TELECOM</td>
					<td>Telecom-Consumer Prods</td>
					<td>35</td>
					<td>125</td>
				</tr>
			</tbody>
		</Table>
	);
}

export default StockTable;
