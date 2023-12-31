import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import ScreenerForm from "../components/screener/ScreenerForm";
import StockTable from "../components/stock/StockTable";
import { useLoadScreenerMutation } from "../redux/screener/api";
import { IScreener } from "../redux/screener/state";


export default function Screener() {
  const navigate = useNavigate();
  const [loadScreener, { data: stocks }] = useLoadScreenerMutation();

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

  function mapStockTable(stock: IScreener, i: number) {
    return (
      <tr key={i} onClick={() => navigate(`/stocks/${stock.ticker}`)}>
        <td>{stock.ticker}</td>
        <td>{stock.name}</td>
        <td>{stock.price}</td>
        <td className={Number(stock.change) > 0 ? "positive" : Number(stock.change) < 0 ? "negative" : ""}>
          {stock.change}
        </td>
        <td className={Number(stock.changePer) > 0 ? "positive" : Number(stock.changePer) < 0 ? "negative" : ""}>
          {stock.changePer}
        </td>
        <td>{stock.yearHigh}</td>
        <td>{stock.marketCap}</td>
        <td>{stock.rsRating}</td>
        <td>{stock.sector}</td>
        <td>{stock.industry}</td>
        <td>{stock.industryRs}</td>
        <td>{stock.industryRank}</td>
      </tr>
    );
  }
  const screenerTable = stocks?.map(mapStockTable);

  return (
    <>
      <Helmet>
        <title>Screener | Stonks</title>
      </Helmet>
      <Container>
        <ScreenerForm loadScreener={loadScreener} stocks={stocks} />
      </Container>
      <Container fluid>
        <StockTable headings={tableHeadings} contents={screenerTable} />
      </Container>
    </>
  );
}
