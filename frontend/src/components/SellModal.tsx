import { useEffect, useState } from "react";
import { Form, Offcanvas } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { env } from "../env";
import { useAppSelector } from "../hook/hooks";
import { useGetBalanceQuery } from "../redux/auth/api";
import { getSharesThunk, sellStockThunk } from "../redux/stock/thunk";
import { BuyFormState } from "./BuyModal";
import { defaultErrorSwal } from "./ReactSwal";

type Props = {
  setIsShow: (isShow: boolean) => void;
};

export type SellFormState = {
  shares: number;
};

export default function BuyModal({ setIsShow }: Props) {
  const dispatch = useDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.auth.user);
  const stock = useAppSelector((state) => state.stock.stock);
  const shares = useAppSelector((state) => state.stock.shares);
  const { ticker } = useParams<{ ticker: string }>();
  const [price, setPrice] = useState(0);
  const { register, handleSubmit, setValue, watch, reset } = useForm<SellFormState>({ defaultValues: { shares: 0 } });
  const hideOffcanvas = () => setIsShow(false);
  const { data: balance } = useGetBalanceQuery();
  const cash = balance?.cash ?? 0;

  function onSubmit(data: BuyFormState) {
    if (data.shares > shares) defaultErrorSwal("Not enough shares");
    if (data.shares > 0) {
      dispatch(sellStockThunk(ticker ? ticker : "", data.shares, price) as any);
      reset();
    }
  }

  function validateValue(e: any) {
    const shares = Number(e.target.value);
    if (shares <= 0) {
      setValue("shares", 0);
    } else {
      setValue("shares", Number(shares.toFixed(2)));
    }
  }

  useEffect(() => {
    if (stock?.price) {
      setPrice(Number(stock?.price));
    }
  }, [stock]);

  useEffect(() => {
    if (user?.payload) {
      dispatch(getSharesThunk(ticker ? ticker : "") as any);
    }
  }, [dispatch, user, ticker]);

  useEffect(() => {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${env.finnhubKey}`);

    socket.addEventListener("open", (e) => {
      if (stock?.sectorName?.toLowerCase() === "crypto".toLowerCase()) {
        socket.send(JSON.stringify({ type: "subscribe", symbol: `BINANCE:${ticker}USDT` }));
      } else {
        socket.send(JSON.stringify({ type: "subscribe", symbol: ticker }));
      }
    });

    socket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      if (data.data) {
        const socketPrice = data.data.at(-1).p;
        setPrice(socketPrice);
      }
    });

    return () => {
      socket.addEventListener("open", () => {
        if (stock?.sectorName?.toLowerCase() === "crypto".toLowerCase()) {
          socket.send(JSON.stringify({ type: "unsubscribe", symbol: `BINANCE:${ticker}USDT` }));
        } else {
          socket.send(JSON.stringify({ type: "unsubscribe", symbol: ticker }));
        }
      });
      socket.close();
    };
  }, [ticker, stock]);

  const totalCost = price * watch("shares");

  return (
    <Offcanvas
      show={true}
      onHide={hideOffcanvas}
      placement="end"
      backdrop={false}
      scroll
      className={"sell-order " + theme}
    >
      <Offcanvas.Header closeButton className="order-header">
        <Offcanvas.Title>SELL</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="title-row">
          <span>{ticker}</span>
          <span>{stock?.name}</span>
        </div>
        <h3>{price.toFixed(2)}</h3>
        <div>Cash BP: ${cash}</div>
        <div>You own: {shares}</div>
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
