import "bootstrap/dist/css/bootstrap.min.css";
import { ConnectedRouter } from "connected-react-router";
import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { history } from "./redux/store/history";
import Portfolio from "./components/Portfolio";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Watchlist from "./components/Watchlist"
import Screener from "./components/Screener"

function App() {
	return (
		<div>
			<ConnectedRouter history={history}>
				<NavBar />
				<Switch>
					<Route path="/" exact component={Home}></Route>
					<Route path="/watchlist" component={Watchlist}></Route>
					<Route path="/screener" component={Screener}></Route>
					<Route path="/portfolio" component={Portfolio}></Route>
				</Switch>
				<Footer />
			</ConnectedRouter>
		</div>
	);
}

export default App;
