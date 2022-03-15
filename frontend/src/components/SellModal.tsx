import { useEffect, useState } from "react";
import { Form, Offcanvas } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { env } from "../env";
import { getBalanceThunk } from "../redux/auth/thunk";
import { buyStockThunk } from "../redux/stock/thunk";
import { RootState } from "../redux/store/state";
import { BuyFormState } from "./BuyModal";
import { defaultErrorSwal } from "./ReactSwal";

type Props = {
	setIsShow: (isShow: boolean) => void;
};

export default function BuyModal({ setIsShow }: Props) {
	const dispatch = useDispatch();
	const theme = useSelector((state: RootState) => state.theme.theme);
	const user = useSelector((state: RootState) => state.auth.user);
	const cash = useSelector((state: RootState) => state.auth.balance.cash);
	const stock = useSelector((state: RootState) => state.stock.stock);
	const { ticker } = useParams<{ ticker: string }>();
	const [price, setPrice] = useState(0);
	const { register, handleSubmit, setValue, watch, reset } = useForm({ defaultValues: { shares: 0 } });
	const hideOffcanvas = () => setIsShow(false);

	function onSubmit(data: BuyFormState) {
		if (data.shares * price > cash) defaultErrorSwal("Not enough cash");
		if (data.shares > 0) {
			dispatch(buyStockThunk(ticker, data.shares, price));
			reset();
		}
	}

	function validateValue(e: any) {
		const shares = Number(e.target.value);
		if (shares <= 0) {
			setValue("shares", 0);
		} else {
			setValue("shares", Math.round(shares));
		}
	}

	useEffect(() => {
		if (stock?.price) {
			setPrice(Number(stock?.price));
		}
	}, [stock]);

	useEffect(() => {
		if (user?.payload) {
			dispatch(getBalanceThunk());
		}
	}, [dispatch, user]);

	useEffect(() => {
		const socket = new WebSocket(`wss://ws.finnhub.io?token=${env.finnhubKey}`);

		socket.addEventListener("open", (e) => {
			socket.send(JSON.stringify({ type: "subscribe", symbol: ticker }));
		});

		socket.addEventListener("message", (e) => {
			const data = JSON.parse(e.data);
			if (data.data) {
				const socketPrice = JSON.parse(e.data).data.at(-1).p;
				setPrice(socketPrice);
			}
		});

		return () => {
			socket.send(JSON.stringify({ type: "unsubscribe", symbol: ticker }));
			socket.close();
		};
	}, [ticker]);

	const totalCost = price * watch("shares");

	return (
		<Offcanvas show={true} onHide={hideOffcanvas} placement="end" backdrop={false} scroll className={theme}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>ORDER</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<div className="title-row">
					<span>{ticker}</span>
					<span>{stock?.name}</span>
				</div>
				<h3>{price.toFixed(2)}</h3>
				<div>Cash BP: ${cash}</div>
				<div>You own: </div>
				<span>QUANTITY</span>
				<div className="input-row">
					<Form onSubmit={handleSubmit(onSubmit)} id="sell-form">
						<Form.Control
							{...register("shares", { valueAsNumber: true })}
							type="number"
							placeholder="shares"
							onBlur={validateValue}
							min="0"
						/>
					</Form>
					<div>Shares</div>
				</div>
				<div className="cost-row">{Number.isNaN(totalCost) ? "" : `Total: ${totalCost.toFixed(2)}`}</div>
				<button type="submit" className="stonk-btn trade-btn" form="sell-form">
					Sell
				</button>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
