import "../css/Stock.css";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AdvancedRealTimeChart, ColorTheme, FundamentalData, SymbolInfo } from "react-ts-tradingview-widgets";
import { RootState } from "../redux/store/state";
import { useParams } from "react-router";
import CommentForm from "./CommentForm";
import StockButtons from "./StockButtons";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { getCommentsThunk, getStockThunk } from "../redux/Stock/thunk";

const env = process.env.REACT_APP_API_ORIGIN;

export default function Stock() {
	const dispatch = useDispatch();
	const theme = useSelector((state: RootState) => state.theme.theme);
	const stock = useSelector((state: RootState) => state.stock.stock);
	const comments = useSelector((state: RootState) => state.stock.comments);
	const { ticker } = useParams<{ ticker: string }>();

	useEffect(() => {
		dispatch(getStockThunk(ticker));
	}, []);

	useEffect(() => {
		if (stock) {
			dispatch(getCommentsThunk(stock.id));
		}
	}, [stock]);

	return (
		<>
			<Helmet>
				<title> {ticker} | Stonks </title>
			</Helmet>
			<Container fluid className="stock-container">
				<Row>
					<Col md={8} className="stock-info">
						<SymbolInfo
							symbol={ticker}
							colorTheme={theme as ColorTheme}
							copyrightStyles={{ parent: { display: "none" } }}
							width="100%"
						></SymbolInfo>
					</Col>
				</Row>
				<Row>
					<Col md={8}>
						<div className="stock-graph">
							<AdvancedRealTimeChart
								symbol={ticker}
								theme={theme as ColorTheme}
								copyrightStyles={{ parent: { display: "none" } }}
								width="100%"
								height="100%"
								interval="D"
								allow_symbol_change={false}
								hide_side_toolbar={true}
								save_image={false}
								withdateranges={false}
							></AdvancedRealTimeChart>
						</div>
						<FundamentalData
							symbol={ticker}
							colorTheme={theme as ColorTheme}
							copyrightStyles={{ parent: { display: "none" } }}
							width="100%"
						></FundamentalData>
					</Col>
					<Col md={4}>
						<StockButtons />
						<div className="news-container">
							<h3>News</h3>
							<div className="news-section">
								{/* <div className="news-wrap">
                            <div className="news-title">
                                <a href=""></a>
                            </div>
                            <div className="news-date"></div>
                        </div> */}
							</div>
						</div>
						<div className="comment-container">
							<h3>Comments</h3>
							<div className="comment-section">
								{comments.map((comment, i) => (
									<div className="comment-wrap" key={i}>
										<img className="avatar" src={`${env}/${comment.avatar}`} alt="avatar" />
										<div className="content">
											<div>
												<span className="username">{comment.username}</span>
												<span className="comment-date">{comment.createdAt}</span>
											</div>
											<div className="content">{comment.content}</div>
										</div>
									</div>
								))}
							</div>
							<CommentForm />
						</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}
