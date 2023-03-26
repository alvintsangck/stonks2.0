import { defaultErrorSwal, defaultSuccessSwal } from "../../util/ReactSwal";
import { emptyApi } from "../api";
import { authApi } from "../auth/api";

export type Stock = {
  id: number;
  ticker: string;
  name: string;
  price: number;
  prevPrice?: number;
  sectorName?: string;
  industryName?: string;
};

export type StockNews = {
  uuid: string;
  link: string;
  providerPublishTime: string;
  publisher: string;
  title: string;
  type: string;
};

export type UserComment = {
  username: string;
  content: string;
  avatar: string;
  createdAt: string;
};

export const stockApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getStock: build.query<Stock, string>({
      query: (ticker) => ({ url: `/stocks/${ticker}` }),
    }),
    getStockNews: build.query<StockNews[], string>({
      query: (ticker) => ({ url: `/stocks/${ticker}/news` }),
    }),
    getShares: build.query<number, string>({
      query: (ticker) => ({ url: `/stocks/${ticker}/shares` }),
      transformResponse: (res: { shares: number }) => res.shares,
    }),
    buyStock: build.mutation<{ cash: number; shares: number }, { ticker: string; shares: number; price: number }>({
      query: ({ ticker, shares, price }) => ({ url: `/stocks/${ticker}/buy`, method: "POST", body: { shares, price } }),
      async onQueryStarted({ ticker, shares }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(stockApi.util.updateQueryData("getShares", ticker, (shares) => data.shares));
          dispatch(
            authApi.util.updateQueryData("getBalance", undefined, (balance) => {
              balance.cash = data.cash;
            })
          );

          defaultSuccessSwal(`Bought ${shares} share${shares > 1 ? "s" : ""} of ${ticker}`);
        } catch (error: any) {
          defaultErrorSwal(error.error.data.error);
        }
      },
    }),
    sellStock: build.mutation<{ cash: number; shares: number }, { ticker: string; shares: number; price: number }>({
      query: ({ ticker, shares, price }) => ({
        url: `/stocks/${ticker}/sell`,
        method: "POST",
        body: { shares, price },
      }),
      async onQueryStarted({ ticker, shares }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(stockApi.util.updateQueryData("getShares", ticker, (shares) => data.shares));
          dispatch(
            authApi.util.updateQueryData("getBalance", undefined, (balance) => {
              balance.cash = data.cash;
            })
          );
          defaultSuccessSwal(`Sold ${shares} share${shares > 1 ? "s" : ""} of ${ticker}`);
        } catch (error: any) {
          defaultErrorSwal(error.error.data.error);
        }
      },
    }),
    getComments: build.query<UserComment[], number>({
      query: (stockId) => ({ url: `/comment/${stockId}` }),
    }),
    postComment: build.mutation<any, { stockId: number; content: string }>({
      query: ({ stockId, content }) => ({ url: `/comment/${stockId}`, method: "POST", body: { content } }),
      async onQueryStarted({ stockId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            stockApi.util.updateQueryData("getComments", stockId, (comments) => {
              comments.push(data);
            })
          );
        } catch (error: any) {
          defaultErrorSwal(error.error.data.error);
        }
      },
    }),
  }),
});

export const {
  useLazyGetStockQuery,
  useGetStockNewsQuery,
  useLazyGetSharesQuery,
  useBuyStockMutation,
  useSellStockMutation,
  useLazyGetCommentsQuery,
  usePostCommentMutation,
} = stockApi;
