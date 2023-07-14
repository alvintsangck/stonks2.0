import { Carousel, Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { MarketOverview } from "react-tradingview-embed";
import LoadingSpinner from "../components/LoadingSpinner";
import "../css/Home.css";
import { useAppSelector } from "../hook/hooks";
import { News, useGetNewsQuery } from "../redux/news/api";
import { env } from "../util/env";

export default function Home() {
  const theme = useAppSelector((state) => state.theme.theme);
  const { data: news, isLoading } = useGetNewsQuery();
  const bigNews = news ? news.slice(0, 3) : [];
  const smallNews = news ? news.slice(3) : [];

  return (
    <>
      <Helmet>
        <title>Home | Stonks</title>
      </Helmet>
      <Container className="home-container">
        <Row className="market-row">
          <Col lg={8}>
            {isLoading ? (
              <div className="loading-container">
                <LoadingSpinner />
              </div>
            ) : (
              <Carousel> {bigNews.map(makeBigNewsElem)}</Carousel>
            )}
          </Col>
          <Col lg={4} className="d-flex justify-content-end">
            <MarketOverview widgetProps={{ colorTheme: theme }} />
          </Col>
        </Row>
        <Row className="news-header">
          <div className="section-title">Latest News</div>
          <div className="bar"></div>
        </Row>
        {isLoading ? <LoadingSpinner /> : <Row>{smallNews.map(makeSmallNewsElem)}</Row>}
      </Container>
    </>
  );
}

function makeBigNewsElem(news: News, i: number) {
  const rawContent = extractContent(news.attributes.content);
  const index = "Getty Images ";
  const content = rawContent?.slice(rawContent.indexOf(index) + index.length);
  const image = news.attributes.gettyImageUrl || `${env.url}/stonk_bg.webp`;
  return (
    <Carousel.Item key={i}>
      <a href={news.links.canonical}>
        <img src={image} alt="news"></img>
        <Carousel.Caption>
          <h2>{news.attributes.title}</h2>
          <p>{content}</p>
        </Carousel.Caption>
      </a>
    </Carousel.Item>
  );
}

function makeSmallNewsElem(news: News, i: number) {
  const header = Object.keys(news.attributes.themes)[0];
  const rawContent = extractContent(news.attributes.content);
  const index = "Getty Images ";
  const content = rawContent?.slice(rawContent.indexOf(index) + index.length);
  const image = news.attributes.gettyImageUrl || `${env.url}/stonk_bg.webp`;
  return (
    <Col md={3} key={i}>
      <div className="small-news">
        <a href={news.links.canonical}>
          <img src={image} alt="news" />
          <div className="small-news-header">{header}</div>
        </a>
      </div>
      <div className="small-news-content">
        <h5>{news.attributes.title}</h5>
        <span>{content}</span>
      </div>
    </Col>
  );
}

function extractContent(html: any) {
  return new DOMParser().parseFromString(html, "text/html").documentElement.textContent;
}
