import "../css/StockTable.css";
import { Table } from "react-bootstrap";

type Props = {
  headings: string[];
  contents: JSX.Element[] | JSX.Element;
};

function StockTable({ headings, contents }: Props) {
  return (
    <Table responsive hover className="stock-table">
      <thead>
        <tr>
          {headings.map((heading) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>{contents}</tbody>
    </Table>
  );
}

export default StockTable;
