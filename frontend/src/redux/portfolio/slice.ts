import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { portfolioApi } from "./api";
import { FinnhubTrade, PortfolioState } from "./state";

const initialState: PortfolioState = {
  portfolio: [],
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    updatePortfolioPrice: (state, action: PayloadAction<FinnhubTrade[]>) => {
      let portfolio = state.portfolio;
      let stocks = action.payload;
      for (let userStock of portfolio) {
        const stock = stocks.find((stock) => stock.s.includes(userStock.ticker));
        if (stock) {
          const price = stock.p;
          const shares = Number(userStock.shares);
          const totalCost = Number(userStock.totalCost);
          userStock.price = price;
          userStock.unitCost = totalCost / shares;
          userStock.marketValue = price * shares;
          userStock.profit = price * shares - totalCost;
        }
      }
      state.portfolio = portfolio;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(portfolioApi.endpoints.getPortfolio.matchFulfilled, (state, { payload }) => {
      state.portfolio = payload;
    });
  },
});

export const { updatePortfolioPrice } = portfolioSlice.actions;
