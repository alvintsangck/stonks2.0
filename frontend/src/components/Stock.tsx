import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AdvancedRealTimeChart, ColorTheme, FundamentalData, SymbolInfo } from "react-ts-tradingview-widgets";
import { RootState } from "../redux/store/state";
import StockButton from "./StockButton";
import "../css/Stock.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import CommentForm from "./CommentForm";

export default function Stock() {
	const theme = useSelector((state: RootState) => state.theme.theme);
	const symbol = "TQQQ";

	const buttons = [
		{ name: "Buy", className: "buy-btn", fn: null },
		{ name: "Sell", className: "sell-btn", fn: null },
		{ name: "Watchlist", className: "watchlist-btn", fn: null },
		{ name: <FontAwesomeIcon icon={faBell} />, className: "noti-btn", fn: null },
	];
	return (
		<Container fluid>
			<Row>
				<Col md={8} className="stock-info">
					<SymbolInfo
						symbol={symbol}
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
							symbol={symbol}
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
						symbol={symbol}
						colorTheme={theme as ColorTheme}
						copyrightStyles={{ parent: { display: "none" } }}
						width="100%"
					></FundamentalData>
				</Col>
				<Col md={4}>
					<div className="button-container">
						{buttons.map(({ name, className }, i) => (
							<StockButton name={name} className={className} key={i}/>
						))}
					</div>
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
                        <div className="comment-section">
                        <div className="comment-wrap">
								<img className="avatar" src="" alt="avatar" />
								<div className="content">
									<div>
										<span className="username"></span>
										<span className="comment-date"></span>
									</div>
									<div className="content"></div>
								</div>
							</div>
                        </div>
						<CommentForm />
					</div>
				</Col>
			</Row>
		</Container>
	);
}
