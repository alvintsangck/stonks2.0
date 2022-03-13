import { Switch, Route, Redirect } from "react-router";
import { Screener } from "react-ts-tradingview-widgets";
import Footer from "./Footer";
import Home from "./Home";
import NoMatch from "./NoMatch";
import Portfolio from "./Portfolio";
import PrivateRoute from "./PrivateRoute";
import Stock from "./Stock";
import NavBar from "./TopNavbar";
import Transfer from "./Transfer";
import Watchlist from "./Watchlist";

export default function DefaultContainer() {
	return (
		<>
			<NavBar />
			<main>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/stocks/:ticker" component={Stock} />
					<PrivateRoute path="/watchlist/:watchlistId?" component={Watchlist} />
					<Route path="/screener" component={Screener} />
					<PrivateRoute path="/portfolio" component={Portfolio} />
					<Route component={NoMatch} />
				</Switch>
				<Switch>
					<PrivateRoute path="/transfer/:method" component={Transfer} />
					<Redirect from="/transfer" to="/transfer/deposit" />
				</Switch>
			</main>
			<Footer />
		</>
	);
}
