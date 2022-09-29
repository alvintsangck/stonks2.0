import { emptyApi } from "../api";

export type EarningCalendar = {
  createdAt: string;
  ticker: string;
  releaseTime: string;
};

export type EarningTable = {
  createdAt: string;
  ticker: string;
  name: string;
  year: number;
  quarter: number;
  epsEstimated: string;
  epsReported: string | null;
  epsSurprise?: string | null;
  revenueEstimated: string;
  revenueReported: string | null;
  revenueSurprise?: string | null;
};

export const calendarApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getAllEarnings: build.query<EarningCalendar[], void>({
      query: () => ({ url: `/calendar/earnings/all` }),
      transformResponse: (res: { earnings: EarningCalendar[] }) => res.earnings,
    }),
    getPastEarningTables: build.query<EarningTable[], void>({
      query: () => ({ url: `/calendar/earnings/past` }),
      transformResponse: (res: { earnings: EarningTable[] }) => res.earnings,
    }),
    getTodayEarningTables: build.query<EarningTable[], void>({
      query: () => ({ url: `/calendar/earnings/now` }),
      transformResponse: (res: { earnings: EarningTable[] }) => res.earnings,
    }),
    getNextEarningTables: build.query<EarningTable[], void>({
      query: () => ({ url: `/calendar/earnings/next` }),
      transformResponse: (res: { earnings: EarningTable[] }) => res.earnings,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllEarningsQuery,
  useGetPastEarningTablesQuery,
  useGetTodayEarningTablesQuery,
  useGetNextEarningTablesQuery,
} = calendarApi;
