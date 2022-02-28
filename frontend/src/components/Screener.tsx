import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Form, FormGroup, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import "../css/Screener.css";
import StockTable from "./StockTable";

export default function Screener() {
	const tableHeadings: string[] = [
		"TICKER",
		"COMPANY NAME",
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
	]
	return (
		<>
			<Helmet>
				<title>Screener | Stonks</title>
			</Helmet>
			<Container fluid>
				<Form id="screener-form">
					<Row>
						<Col>
							<h1>Screener</h1>
						</Col>
						<Col>
							<button type="submit" className="screen-btn">
								View Screen Results
							</button>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<Form.Group className="screener-items">
								<h4>Price ($)</h4>
								<div>
									<Form.Control type="number" placeholder="min" min="0" max="1000000"></Form.Control>
									<span>to</span>
									<Form.Control type="number" placeholder="max" min="0" max="1000000"></Form.Control>
								</div>
							</Form.Group>
							<Form.Group className="screener-items">
								<h4>% Off 52-week High</h4>
								<div>
									<Form.Control type="number" placeholder="min" min="0" max="100"></Form.Control>
									<span>to</span>
									<Form.Control type="number" placeholder="max" min="0" max="100"></Form.Control>
								</div>
							</Form.Group>
							<Form.Group className="screener-items">
								<h4>Market Capitalization (Million)</h4>
								<div>
									<Form.Control type="number" placeholder="min" min="0" max="5000000"></Form.Control>
									<span>to</span>
									<Form.Control type="number" placeholder="max" min="0" max="5000000"></Form.Control>
								</div>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group className="screener-items">
								<h4>RS Rating (1-99)</h4>
								<div>
									<Form.Control type="number" placeholder="min" min="0" max="100" />
									<span>to</span>
									<Form.Control type="number" placeholder="max" min="0" max="100" />
								</div>
							</Form.Group>
							<Form.Group className="screener-items">
								<h4>Industry RS Rating (1-99)</h4>
								<div>
									<Form.Control type="number" placeholder="min" min="0" max="100" />
									<span>to</span>
									<Form.Control type="number" placeholder="max" min="0" max="100" />
								</div>
							</Form.Group>
							<Form.Group className="screener-items">
								<h4>Industry Ranking (1-197)</h4>
								<div>
									<Form.Control type="number" placeholder="min" min="1" max="197" />
									<span>to</span>
									<Form.Control type="number" placeholder="max" min="1" max="197" />
								</div>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group className="screener-selection">
								<div>
									<h4>Industry Name</h4>
									<Button variant="primary reset-btn">Reset</Button>
								</div>
								<div>
									<Form.Check inline type="radio" label="include" />
									<Form.Check inline type="radio" label="exclude" />
								</div>
							</Form.Group>
							<Form.Group className="screener-selection">
								<ListGroup className="screen-list"></ListGroup>
								<FontAwesomeIcon icon={faArrowRight} />
								<ListGroup className="screen-list"></ListGroup>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group className="screener-selection">
								<div>
									<h4>Sector Name</h4>
									<Button variant="primary reset-btn">Reset</Button>
								</div>
								<div>
									<Form.Check inline type="radio" label="include" />
									<Form.Check inline type="radio" label="exclude" />
								</div>
							</Form.Group>
							<Form.Group className="screener-selection">
								<ListGroup className="screen-list"></ListGroup>
								<FontAwesomeIcon icon={faArrowRight} />
								<ListGroup className="screen-list"></ListGroup>
							</Form.Group>
						</Col>
					</Row>
				</Form>
				<h4 className='screen-result'>Number of stocks found:</h4>
				<StockTable headings={tableHeadings} content={['']}/>
			</Container>
		</>
	);
}
