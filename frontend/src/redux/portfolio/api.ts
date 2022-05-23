import { emptyApi } from "../api";
import { UserPortfolio } from "./state";

export const portfolioApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getPortfolio: build.query<UserPortfolio[], void>({
      query: () => ({ url: `/user/portfolio` }),
      transformResponse: (res: { portfolio: UserPortfolio[] }) => res.portfolio,
    }),
  }),
  overrideExisting: false,
});

export const { useGetPortfolioQuery } = portfolioApi;
