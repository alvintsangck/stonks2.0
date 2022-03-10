import { useEffect } from "react";
import { Carousel, Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { ColorTheme, MarketOverview } from "react-ts-tradingview-widgets";
import "../css/Home.css";
import { env } from "../env";
import { News } from "../redux/news/state";
import { getNewsThunk } from "../redux/news/thunk";
import { RootState } from "../redux/store/state";
import LoadingSpinner from "./LoadingSpinner";



export default function Home() {
	const theme = useSelector((state: RootState) => state.theme.theme);
	const news = useSelector((state: RootState) => state.news.news);
	const isLoading = useSelector((state: RootState) => state.news.isLoading);
	const dispatch = useDispatch();
	const bigNews = news.slice(0, 3);
	const smallNews = news.slice(3);

	useEffect(() => {
		dispatch(getNewsThunk());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Helmet>
				<title>Home | Stonks</title>
			</Helmet>
			<Container>
				<Row className="market-row">
					<Col md={8}>
						<Carousel>{isLoading ? <LoadingSpinner /> : bigNews.map(makeBigNewsElem)}</Carousel>
					</Col>
					<Col md={4}>
						<MarketOverview
							colorTheme={theme as ColorTheme}
							height="650px"
							width="100%"
							copyrightStyles={{ parent: { display: "none" } }}
						/>
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
	return (
		<Carousel.Item key={i}>
			<a href={news.links.canonical}>
				<img src={news.attributes.gettyImageUrl} alt=""></img>
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
	const image = news.attributes.gettyImageUrl || `${env}/stonk_bg.webp`;
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
