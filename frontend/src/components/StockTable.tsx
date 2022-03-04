import "../css/StockTable.css";
import { Table } from "react-bootstrap";

type Props = {
	headings: string[];
	content: any[];
};

function StockTable({ headings, content: contents }: Props) {
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
					const { id, ...obj } = content;
					const values = Object.values(obj);
					return (
						<tr key={i} id={String(id)}>
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
