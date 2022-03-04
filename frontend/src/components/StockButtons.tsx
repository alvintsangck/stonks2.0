import "../css/StockButtons.css"
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import WatchlistModal from "./WatchlistModal";

export default function StockButtons() {
	const [isShow, setIsShow] = useState(false);
	const buttons = [
		{ name: "Buy", className: "buy-btn", onClick: () => {} },
		{ name: "Sell", className: "sell-btn", onClick: () => {} },
		{ name: "Watchlist", className: "watchlist-btn", onClick: () => setIsShow(true) },
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
			<WatchlistModal isShow={isShow} setIsShow={setIsShow} />
		</>
	);
}
