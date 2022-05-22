import { defaultErrorSwal } from "../../components/ReactSwal";
import { callApi } from "../api";
import { getPortfolioAction, getPortfolioPriceAction } from "./action";
import { UserPortfolio } from "./state";

export function getPortfolioThunk() {
  return async (dispatch: any) => {
    const result = await callApi("/user/portfolio");
    if ("error" in result) {
      defaultErrorSwal(result.error);
    } else {
      dispatch(getPortfolioAction(result.portfolio));
    }
  };
}

export function getPortfolioPriceThunk(stocks: UserPortfolio[]) {
  return async (dispatch: any) => {
    let stockArr = [];
    for (let stock of stocks) {
      const result = await callApi(`/stocks/${stock.ticker}`);
      if ("error" in result) {
        defaultErrorSwal(result.error);
        return;
      } else {
        stockArr.push({ s: result.ticker, p: Number(result.price) });
      }
    }
    dispatch(getPortfolioPriceAction(stockArr));
  };
}
