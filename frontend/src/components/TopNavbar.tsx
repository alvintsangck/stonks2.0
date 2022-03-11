import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../redux/store/state";
import "../css/NavBar.css";
import { Col, Container, Dropdown, Nav, Navbar, Row } from "react-bootstrap";
import { SearchForm } from "./SearchForm";
import { ColorTheme, TickerTape } from "react-ts-tradingview-widgets";

export default function NavBar() {
	// const dispatch = useDispatch();
	// const user = useSelector((state: RootState) => state.auth.user);
	const theme = useSelector((state: RootState) => state.theme.theme);

	return (
		<nav className="nav-bar">
			<TickerTape colorTheme={theme as ColorTheme} copyrightStyles={{ parent: { display: "none" } }} />
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
						<SearchForm />
					</Col>
				</Row>
			</Container>
			<Navbar collapseOnSelect expand="md" className="blue" variant="dark">
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="m-auto">
						<NavLink to="/">
							<span className="nav-item">Home</span>
						</NavLink>
						<NavLink to="/watchlist">
							<span className="nav-item">Watchlist</span>
						</NavLink>
						<NavLink to="/screener">
							<span className="nav-item">Screener</span>
						</NavLink>
						<NavLink to="/portfolio">
							<span className="nav-item">Portfolio</span>
						</NavLink>
						<NavLink to="/transfer">
							<span className="nav-item">Transfer</span>
						</NavLink>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</nav>
	);
}