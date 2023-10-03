import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AdvancedChart, FundamentalData, SymbolInfo } from "react-tradingview-embed";
import Comments from "../components/comment/Comments";
import StockButtons from "../components/stock/StockButtons";
import "../css/Stock.css";
import { localTime } from "../helper";
import { useGetStockNewsQuery } from "../redux/stock/api";
import { RootState } from "../redux/store/state";

export default function Stock() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const ticker = useParams<{ ticker: string }>().ticker ?? "";
  const { data: news } = useGetStockNewsQuery(ticker);

  return (
    <>
      <Helmet>
        <title> {ticker} | Stonks </title>
      </Helmet>
      <Container fluid className="stock-container">
        <Row>
          <Col md={8} className="stock-info">
            <SymbolInfo widgetProps={{ symbol: ticker, colorTheme: theme, width: "100%" }} />
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <div className="stock-graph">
              <AdvancedChart
                widgetProps={{
                  symbol: ticker,
                  theme: theme,
                  interval: "D",
                  allow_symbol_change: false,
                  hide_side_toolbar: true,
                  save_image: false,
                  withdateranges: false,
                }}
              />
            </div>
            <FundamentalData widgetProps={{ symbol: ticker, colorTheme: theme, width: "100%" }} />
          </Col>
          <Col md={4}>
            <StockButtons />
            <div className="news-container">
              <h3>News</h3>
              <div className="news-section">
                {news?.map((news) => (
                  <div className="news-wrap" key={news.uuid}>
                    <div className="news-title">
                      <a href={news.link}>{news.title}</a>
                    </div>
                    <div className="news-date">{localTime(news.providerPublishTime)}</div>
                  </div>
                ))}
              </div>
            </div>
            <Comments />
          </Col>
        </Row>
      </Container>
    </>
  );
}
