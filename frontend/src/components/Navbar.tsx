import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../redux/store/state";
import "../css/NavBar.css";
import { Col, Container, Dropdown, Nav, Navbar, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SearchForm } from "./SearchForm";

export default function NavBar() {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.auth.user);

	return (
		<nav>
			<Container fluid>
				<Row>
					<Col md={3}>
						<div className="login">
							<NavLink className="non-user" to="/login">
								Login
							</NavLink>
							<NavLink className="non-user" to="/login">
								Register
							</NavLink>
						</div>
						<Dropdown className="user-only">
							<Dropdown.Toggle className="user-avatar-btn">
								<img className="user-avatar" src={"STONK.png"} alt="user-avatar" />
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item>
									<NavLink className="dropdown-item" to="/setting">
										User Setting
									</NavLink>
								</Dropdown.Item>
								<Dropdown.Item>Change Theme</Dropdown.Item>
								<Dropdown.Item>Log Out</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Col>
					<Col md={6} className="brand-name">
						<NavLink to="/">
							<span>STONKS</span>
							<div>Tecky Academy</div>
						</NavLink>
					</Col>
					<Col md={3} className="search-bar">
						{/* <form action="#" className="search-form">
							<div className="form-group">
								<input
									type="search"
									className="form-control"
									placeholder="Search Ticker"
									name="tickerInput"
								/>
							</div>
							<button type="submit" className="form-control search-btn">
								<FontAwesomeIcon icon={faSearch} className="" />
							</button>
						</form> */}
						<SearchForm />
					</Col>
				</Row>
			</Container>
			<Navbar collapseOnSelect expand="md" className="blue" variant="dark">
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="m-auto">
						<NavLink to="/">
							<span>Home</span>
						</NavLink>
						<NavLink to="/watchlist">
							<span>Watchlist</span>
						</NavLink>
						<NavLink to="/screener">
							<span>Screener</span>
						</NavLink>
						<NavLink to="/portfolio">
							<span>Portfolio</span>
						</NavLink>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</nav>
	);
}
