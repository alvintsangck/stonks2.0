import { emptyApi } from "../api";
import { Industry, IScreener, LoadScreenerBody, Sector } from "./state";

export const screenerApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getIndustries: build.query<Industry[], void>({
      query: () => ({ url: "/industries" }),
    }),
    getSectors: build.query<Sector[], void>({
      query: () => ({ url: "/sectors" }),
    }),
    loadScreener: build.mutation<IScreener[], LoadScreenerBody>({
      query: (body) => ({ url: "/screener", method: "POST", body }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetIndustriesQuery, useGetSectorsQuery, useLoadScreenerMutation } = screenerApi;
