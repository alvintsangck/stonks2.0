import "bootstrap/dist/css/bootstrap.min.css";
import { ConnectedRouter } from "connected-react-router";
import "./App.css";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import { history } from "./redux/store/history";

function App() {
	return (
		<div>
			<ConnectedRouter history={history}>
				<NavBar />
				<h1>Stonks 2.0</h1>
				<Footer />
			</ConnectedRouter>
		</div>
	);
}

export default App;
