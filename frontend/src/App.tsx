import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./redux/store/history";
import { Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/TopNavbar";
import Portfolio from "./components/Portfolio";
import Home from "./components/Home";
import Watchlist from "./components/Watchlist";
import Screener from "./components/Screeners";
import Stock from "./components/Stock";
import Transfer from "./components/Transfer";

function App() {
	return (
		<ConnectedRouter history={history}>
			<NavBar />
			<main>
				<Switch>
					<Route path="/" exact component={Home}></Route>
					<Route path="/stocks/:ticker" component={Stock}></Route>
					<Route path="/watchlist/:watchlistId?" component={Watchlist}></Route>
					<Route path="/screener" component={Screener}></Route>
					<Route path="/portfolio" component={Portfolio}></Route>
					<Route path="/transfer" component={Transfer}></Route>
				</Switch>
			</main>
			<Footer />
		</ConnectedRouter>
	);
}

export default App;
