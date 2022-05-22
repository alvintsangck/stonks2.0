import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import DefaultContainer from "./components/DefaultContainer";
import { TickerTape } from "react-tradingview-embed";
import { useAppSelector } from "./hook/hooks";

function App() {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <>
      <div className="tape-section">
        <TickerTape widgetProps={{ colorTheme: theme, displayMode: "regular" }} />
      </div>
      <Routes>
        <Route path="/login" element={Login} />
        <Route element={DefaultContainer} />
      </Routes>
    </>
  );
}

export default App;
