import { defaultErrorSwal, defaultSuccessSwal } from "../../components/ReactSwal";
import { emptyApi } from "../api";
import { Stock } from "../stock/api";

export type Watchlist = {
  id: number;
  name: string;
};

export const watchlistApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getWatchlists: build.query<Watchlist[], void>({
      query: () => ({ url: `/watchlist/all` }),
    }),
    getWatchlistById: build.query<Stock[], number>({
      query: (watchlistId) => ({ url: `/watchlist/${watchlistId}` }),
    }),
    addWatchlist: build.mutation<Watchlist, string>({
      query: (name) => ({ url: `/watchlist`, method: "POST", body: { name } }),
      async onQueryStarted(name, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            watchlistApi.util.updateQueryData("getWatchlists", undefined, (watchlists) => {
              watchlists.push(data);
            })
          );
          defaultSuccessSwal(`Watchlist ${name} added`);
        } catch (error: any) {
          defaultErrorSwal(error.error.data.error);
        }
      },
    }),
    renameWatchlist: build.mutation<{ message: string }, Watchlist>({
      query: ({ id, name }) => ({ url: `/watchlist/${id}`, method: "PUT", body: { name } }),
      async onQueryStarted({ id, name }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            watchlistApi.util.updateQueryData("getWatchlists", undefined, (watchlists) => {
              let index = watchlists.findIndex((w) => w.id === id);
              watchlists[index].name = name;
            })
          );
          defaultSuccessSwal(data.message);
        } catch (error: any) {
          defaultErrorSwal(error.error.data.error);
        }
      },
    }),
    deleteWatchlist: build.mutation<{ message: string }, number>({
      query: (watchlistId) => ({ url: `/watchlist/${watchlistId}`, method: "DELETE" }),
      async onQueryStarted(watchlistId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            watchlistApi.util.updateQueryData("getWatchlists", undefined, (watchlists) => {
              return watchlists.filter((w) => w.id !== watchlistId);
            })
          );
          defaultSuccessSwal(data.message);
        } catch (error: any) {
          defaultErrorSwal(error.error.data.error);
        }
      },
    }),
    addStock: build.mutation<Stock, { watchlistId: number; ticker: string }>({
      query: ({ watchlistId, ticker }) => ({ url: `/watchlist/${watchlistId}/${ticker}`, method: "POST" }),
      async onQueryStarted({ watchlistId, ticker }, { dispatch, queryFulfilled }) {
        try {
          const { data: stock } = await queryFulfilled;
          dispatch(
            watchlistApi.util.updateQueryData("getWatchlistById", watchlistId, (stocks) => {
              stocks.push(stock);
            })
          );
          defaultSuccessSwal(`${ticker} added to watchlist`);
        } catch (error: any) {
          defaultErrorSwal(error.error.data.error);
        }
      },
    }),
    deleteStock: build.mutation<{ message: string }, { watchlistId: number; stockId: number }>({
      query: ({ watchlistId, stockId }) => ({ url: `/watchlist/${watchlistId}/${stockId}`, method: "DELETE" }),
      async onQueryStarted({ watchlistId, stockId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            watchlistApi.util.updateQueryData("getWatchlistById", watchlistId, (stocks) => {
              return stocks.filter((s) => s.id !== stockId);
            })
          );
          defaultSuccessSwal(data.message);
        } catch (error: any) {
          defaultErrorSwal(error.error.data.error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWatchlistsQuery,
  useLazyGetWatchlistByIdQuery,
  useAddWatchlistMutation,
  useRenameWatchlistMutation,
  useDeleteWatchlistMutation,
  useAddStockMutation,
  useDeleteStockMutation,
} = watchlistApi;
