import "../css/StockButtons.css";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";
import WatchlistModal from "./WatchlistModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { push } from "connected-react-router";

export default function StockButtons() {
	const dispatch = useDispatch();
	// const [isShowBuy, setIsShowBuy] = useState(false);
	// const [isShowSell, setIsShowSell] = useState(false);
	const [isShowWatchlist, setIsShowWatchlist] = useState(false);
	// const [isShowNoti, setIsShowNoti] = useState(false);
	const user = useSelector((state: RootState) => state.auth.user);

	function setIsShow(fn: Dispatch<SetStateAction<boolean>>) {
		if (user) {
			fn(true);
		} else {
			dispatch(push("/login"));
		}
	}
	const buttons = [
		{ name: "Buy", className: "buy-btn", onClick: () => {} },
		{ name: "Sell", className: "sell-btn", onClick: () => {} },
		{ name: "Watchlist", className: "watchlist-btn", onClick: () => setIsShow(setIsShowWatchlist) },
		{ name: <FontAwesomeIcon icon={faBell} />, className: "noti-btn", onClick: () => {} },
	];

	return (
		<>
			<div className="button-container">
				{buttons.map(({ name, className, onClick }) => (
					<button className={className} onClick={onClick} key={className}>
						{name}
					</button>
				))}
			</div>
			<WatchlistModal isShow={isShowWatchlist} setIsShow={setIsShowWatchlist} />
		</>
	);
}
