import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../redux/store/state";
import "../css/NavBar.css";
import { Col, Container, Dropdown, Nav, Navbar, Row } from "react-bootstrap";
import { SearchForm } from "./SearchForm";
import { env } from "../env";
import { logoutThunk } from "../redux/auth/thunk";
import { toggleThemeAction } from "../redux/theme/action";
import { TickerTape } from "react-tradingview-embed";

export default function NavBar() {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.auth.user);
	const theme = useSelector((state: RootState) => state.theme.theme);

	return (
		<nav className="nav-bar">
			<TickerTape widgetProps={{colorTheme:theme}} />
			<Container fluid>
				<Row className="align-items-center">
					<Col md={3}>
						{!user && (
							<div className="login">
								<NavLink className="non-user" to="/login">
									Login
								</NavLink>
								<NavLink className="non-user" to="/login">
									Register
								</NavLink>
							</div>
						)}
						{user && (
							<Dropdown>
								<Dropdown.Toggle className="user-avatar-btn">
									<img
										className="user-avatar"
										src={`${env}/${user.payload.avatar}`}
										alt="user-avatar"
									/>
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item>
										{/* <NavLink className="dropdown-item" to="/setting"> */}
										User Setting
										{/* </NavLink> */}
									</Dropdown.Item>
									<Dropdown.Item onClick={() => dispatch(toggleThemeAction())}>
										Change Theme
									</Dropdown.Item>
									<Dropdown.Item onClick={() => dispatch(logoutThunk())}>Log Out</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						)}
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
