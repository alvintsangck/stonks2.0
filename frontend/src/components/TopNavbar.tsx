import { Col, Container, Dropdown, Nav, Navbar, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/NavBar.css";
import { useAppSelector } from "../hook/hooks";
import { logout } from "../redux/auth/slice";
import { RootState } from "../redux/store/state";
import { toggleTheme } from "../redux/theme/slice";
import { env } from "../util/env";
import { SearchForm } from "./SearchForm";

export default function NavBar() {
  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.auth.user);
  const theme = useAppSelector((state: RootState) => state.theme.theme);
  const userLogout = () => {
    localStorage.setItem("token", "");
    logout();
    navigate("/");
  };

  return (
    <nav className="nav-bar">
      <Container fluid>
        <Row className="align-items-center">
          <Col xs={3}>
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
                  <img className="user-avatar" src={`${env.url}/${user.payload.avatar}`} alt="user-avatar" />
                </Dropdown.Toggle>
                <Dropdown.Menu variant={theme}>
                  <Dropdown.Item onClick={() => navigate(`/portfolio`)}>{user.payload.username}</Dropdown.Item>
                  {/* <Dropdown.Item>
										<NavLink className="dropdown-item" to="/setting">
										User Setting
										</NavLink>
									</Dropdown.Item> */}
                  <Dropdown.Item onClick={() => toggleTheme()}>Change Theme</Dropdown.Item>
                  <Dropdown.Item onClick={() => userLogout()}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Col>
          <Col xs={6} className="brand-name">
            <NavLink to="/">
              <span>STONKS</span>
              <div>Tecky Academy</div>
            </NavLink>
          </Col>
          <Col xs={3} className="search-bar">
            <SearchForm />
          </Col>
        </Row>
      </Container>
      <Navbar collapseOnSelect expand="md" className="blue" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="m-auto">
            <Nav.Link href="#" onClick={() => navigate("/")}>
              <span className="nav-item">Home</span>
            </Nav.Link>
            <Nav.Link href="#" onClick={() => navigate("/watchlist")}>
              <span className="nav-item">Watchlist</span>
            </Nav.Link>
            <Nav.Link href="#" onClick={() => navigate("/screener")}>
              <span className="nav-item">Screener</span>
            </Nav.Link>
            <Nav.Link href="#" onClick={() => navigate("/portfolio")}>
              <span className="nav-item">Portfolio</span>
            </Nav.Link>
            <Nav.Link href="#" onClick={() => navigate("/dashboard")}>
              <span className="nav-item">Dashboard</span>
            </Nav.Link>
            <Nav.Link href="#" onClick={() => navigate("/calendar")}>
              <span className="nav-item">Calendar</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </nav>
  );
}
