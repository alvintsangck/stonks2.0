import "bootstrap/dist/css/bootstrap.min.css";
import { ConnectedRouter } from "connected-react-router";
import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { history } from "./redux/store/history";
import Portfolio from "./components/Portfolio";
import { Route } from "react-router-dom";

function App() {
	return (
		<div>
			<ConnectedRouter history={history}>
				<NavBar />
				<h1>Stonks 2.0</h1>
				{/* <Route path="/portfolio" component={Portfolio}></Route> */}
				<Portfolio /> <Footer />
			</ConnectedRouter>
		</div>
	);
}

export default App;
