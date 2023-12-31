import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../css/StockButtons.css";
import { RootState } from "../../redux/store/state";
import WatchlistModal from "../watchlist/WatchlistModal";
import BuyOffcanvas from "./BuyOffcanvas";
import NotiModal from "./NotiModal";
import SellOffcanvas from "./SellOffcanvas";

export default function StockButtons() {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const [isShowBuy, setIsShowBuy] = useState(false);
  const [isShowSell, setIsShowSell] = useState(false);
  const [isShowWatchlist, setIsShowWatchlist] = useState(false);
  const [isShowNoti, setIsShowNoti] = useState(false);

  function setIsShow(fn: Dispatch<SetStateAction<boolean>>) {
    if (user) {
      fn(true);
    } else {
      navigate("/login");
    }
  }

  const buttons = [
    { name: "Buy", className: "buy-btn", fn: setIsShowBuy },
    { name: "Sell", className: "sell-btn", fn: setIsShowSell },
    { name: "Watchlist", className: "watchlist-btn", fn: setIsShowWatchlist },
    { name: <FontAwesomeIcon icon={faBell as IconProp} />, className: "noti-btn", fn: setIsShowNoti },
  ];

  return (
    <>
      <div className="button-container">
        {buttons.map(({ name, className, fn }) => (
          <button className={className} onClick={() => setIsShow(fn)} key={className}>
            {name}
          </button>
        ))}
      </div>
      {isShowBuy && <BuyOffcanvas setIsShow={setIsShowBuy} />}
      {isShowSell && <SellOffcanvas setIsShow={setIsShowSell} />}
      <WatchlistModal isShow={isShowWatchlist} setIsShow={setIsShowWatchlist} />
      <NotiModal isShow={isShowNoti} setIsShow={setIsShowNoti} />
    </>
  );
}
