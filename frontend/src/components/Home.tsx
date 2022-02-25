import { Carousel, Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { ColorTheme, MarketOverview } from "react-ts-tradingview-widgets";
import "../css/Home.css";
import { RootState } from "../redux/store/state";

export default function Home() {
	const theme = useSelector((state: RootState) => state.theme.theme);

	return (
		<>
			<Helmet>
				<title>Home | Stonks</title>
			</Helmet>
			<Container fluid>
				<Row className="market-row">
					<Col md={8}>
						<Carousel>
							<Carousel.Item>
								<img src="news_1.jpeg" alt=""></img>
								<Carousel.Caption>
									<p>hi</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<img src="news_1.jpeg" alt=""></img>
								<Carousel.Caption>
									<p>hihi</p>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<img src="news_1.jpeg" alt=""></img>
								<Carousel.Caption>
									<p>hihihi</p>
								</Carousel.Caption>
							</Carousel.Item>
						</Carousel>
					</Col>
					<Col md={4}>
						<MarketOverview
							colorTheme={theme as ColorTheme}
							height="650px"
							width="400px"
							copyrightStyles={{ parent: { display: "none" } }}
						/>
					</Col>
				</Row>
				<Row className="news-header">
					<div className="section-title">Latest News</div>
					<div className="bar"></div>
				</Row>
				<Row>
					<Col md={3}>
						<div className="small-news">
							<a href="/">
								<img src="news_1.jpeg" alt="" />
								<div className="small-news-header">Head</div>
							</a>
						</div>
						<div className="small-news-content">
							<h4>aaaaaaa</h4>
							<span>aaa</span>
						</div>
					</Col>
					<Col md={3}>
						<div className="small-news">
							<a href="/">
								<img src="news_1.jpeg" alt="" />
								<div className="small-news-header">Head</div>
							</a>
						</div>
						<div className="small-news-content">
							<h4>aaaaaaa</h4>
							<span>aaa</span>
						</div>
					</Col>
					<Col md={3}>
						<div className="small-news">
							<a href="/">
								<img src="news_1.jpeg" alt="" />
								<div className="small-news-header">Head</div>
							</a>
						</div>
						<div className="small-news-content">
							<h4>aaaaaaa</h4>
							<span>aaa</span>
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}
