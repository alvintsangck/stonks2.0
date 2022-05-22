import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { RootState } from "../redux/store/state";
import Calendar from "./Calendar";
import Footer from "./Footer";
import Home from "./Home";
import NoMatch from "./NoMatch";
import Portfolio from "./Portfolio";
import PowerBI from "./PowerBI";
import PrivateRoute from "./PrivateRoute";
import Screener from "./Screener";
import Stock from "./Stock";
import NavBar from "./TopNavbar";
import Transfer from "./Transfer";
import Watchlist from "./Watchlist";

export default function DefaultContainer() {
	const theme = useSelector((state: RootState) => state.theme.theme);

	return (
		<div className={theme} id="app">
			<NavBar />
			<main>
				<Routes>
					<Route path="/" element={Home} />
					<Route path="/stocks/:ticker" element={Stock} />
					<PrivateRoute path="/watchlist/:watchlistId?" element={Watchlist} />
					<Route path="/screener" element={Screener} />
					<PrivateRoute path="/portfolio" element={Portfolio} />
					<PrivateRoute path="/transfer/:method" element={Transfer} />
					<Route path="/dashboard" element={PowerBI} />
					<Route path="/calendar" element={Calendar} />
					<Route path="/transfer" element={<Navigate replace to="/transfer/deposit" />} />
					<Route element={NoMatch} />
				</Routes>
			</main>
			<Footer />
		</div>
	);
}
