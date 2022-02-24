import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../redux/store/state";
import "../css/NavBar.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavBar() {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.auth.user);

	return (
		<nav>
			<Container fluid>
				<div className="row">
					<div className="col-md-3">
						<div className="login">
							<NavLink className="non-user" to="/login">
								Login
							</NavLink>
							<NavLink className="non-user" to="/login">
								Register
							</NavLink>
						</div>
						<div className="dropdown user-only">
							<button
								className="btn dropdown-toggle user-avatar-btn"
								type="button"
								id="dropdownMenuButton1"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<img className="user-avatar" src={""} alt="user-avatar" />
							</button>
							<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
								<li>
									<NavLink className="dropdown-item" to="/setting">
										User Setting
									</NavLink>
								</li>
								<li>
									<button className="dropdown-item theme">Change Theme</button>
								</li>
								<li>
									<button className="dropdown-item log-out">Log Out</button>
								</li>
							</ul>
						</div>
					</div>
					<div className="brand-name col-md-6">
						<NavLink className="navbar-brand" to="/">
							STONKS
							<div>Tecky Academy</div>
						</NavLink>
					</div>
					<div className="col-md-3">
						<form action="#" className="search-form order-lg-last">
							<div className="form-group">
								<input
									type="search"
									className="form-control"
									placeholder="Search Ticker"
									name="tickerInput"
								/>
							</div>
							<button type="submit" className="form-control search-btn">
								{/* <FontAwesomeIcon icon="fa-solid fa-coffee" symbol/> */}
							</button>
						</form>
					</div>
				</div>
			</Container>
			<Navbar collapseOnSelect expand="md" className="blue" variant="dark">
				<Navbar.Toggle aria-controls="responsive-navbar-nav" className="" />
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
