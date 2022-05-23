import { Navigate, Route, Routes } from "react-router-dom";
import TickerTape from "react-tradingview-embed/dist/components/TickerTape";
import { useAppSelector } from "../hook/hooks";
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
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div className={theme} id="app">
      <div className="tape-section">
        <TickerTape widgetProps={{ colorTheme: theme, displayMode: "regular" }} />
      </div>
      <NavBar />
      <main>
        <Routes>
          <Route path="stocks/:ticker" element={<Stock />} />
          <Route element={<PrivateRoute />}>
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="watchlist/:watchlistId" element={<Watchlist />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="transfer/:method" element={<Transfer />} />
            <Route path="transfer" element={<Navigate replace to="/transfer/deposit" />} />
          </Route>
          <Route path="screener" element={<Screener />} />
          <Route path="dashboard" element={<PowerBI />} />
          <Route path="calendar" element={<Calendar />} />
          <Route index element={<Home />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
