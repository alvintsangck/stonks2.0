import { Table } from "react-bootstrap";
import "../../css/StockTable.css";

type Props = {
  headings: string[];
  contents: JSX.Element[] | JSX.Element | undefined;
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
