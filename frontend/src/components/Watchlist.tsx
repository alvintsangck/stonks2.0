import { Helmet } from "react-helmet";
import { Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "./Sidebar";
import AddForm from "./AddForm";
import "../css/Watchlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Watchlist() {
	const tableHeadings = ["Ticker", "Company Name", "Price", "Change", "Change %"];

	return (
		<>
			<Helmet>
				<title>Watchlist | Stonks</title>
			</Helmet>
			<Container fluid>
				<Row>
					<Col md={3}>
						<Sidebar />
					</Col>
					<Col md={9}>
						<AddForm name={"hi"} placeholder="stock" />
						<Table responsive>
							<thead>
								<tr>
									{tableHeadings.map((tableHeading, i) => (
										<th key={i}>{tableHeading}</th>
									))}
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>2</td>
									<td>3</td>
									<td>4</td>
									<td>5</td>
									<td><FontAwesomeIcon icon={faTimes}/></td>
								</tr>
							</tbody>
						</Table>
					</Col>
				</Row>
			</Container>
		</>
	);
}
