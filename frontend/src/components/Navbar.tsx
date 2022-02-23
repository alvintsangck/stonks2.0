// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../redux/store/state";

export default function Navbar() {
	// const dispatch = useDispatch();
	// const user = useSelector((state: RootState) => state.auth);

	return (
		<nav>
			<div className="row">
				<div className="col-md-2 social-media">
					<p className="mb-0 d-flex">
						<a href="login.html" className="boarder1 non-user">
							Login
						</a>
						<a href="login.html" className="non-user">
							Register
						</a>
					</p>
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
								<a className="dropdown-item" href="setting.html">
									User Setting
								</a>
							</li>
							<li>
								<button className="dropdown-item theme">Change Theme</button>
							</li>
							<li>
								<a className="dropdown-item log-out" href="/user/logout">
									Log Out
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="brand-name col-md-8">
					<a className="navbar-brand" href="index.html">
						STONKS
						<div>Tecky Academy</div>
					</a>
				</div>
				<div className="col-md-2">
					<form action="#" className="search-form order-lg-last">
						<div className="form-group d-flex">
							<input
								type="search"
								className="form-control pl-3"
								placeholder="Search Ticker"
								name="tickerInput"
							/>
							<button type="submit" placeholder="" className="form-control search">
								<span className="fa fa-search"></span>
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
				<div className="container-fluid blue-color">
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#ftco-nav"
						aria-controls="ftco-nav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="fa fa-bars"></span> Menu
					</button>
					<div className="collapse navbar-collapse" id="ftco-nav">
						<ul className="navbar-nav m-auto">
							<li className="nav-item active">
								<a href="/" className="nav-link">
									Home
								</a>
							</li>
							<li className="nav-item">
								<a href="/watchlist" className="nav-link">
									Watchlist
								</a>
							</li>
							<li className="nav-item">
								<a href="/screener" className="nav-link">
									Screener
								</a>
							</li>
							<li className="nav-item">
								<a href="/portfolio" className="nav-link">
									Portfolio
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
}
