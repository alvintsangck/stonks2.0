import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./redux/store/history";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import DefaultContainer from "./components/DefaultContainer";

function App() {
	return (
		<ConnectedRouter history={history}>
			<Switch>
				<Route path="/login" exact component={Login} />
				<Route component={DefaultContainer} />
			</Switch>
		</ConnectedRouter>
	);
}

export default App;
