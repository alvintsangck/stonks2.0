import { emptyApi } from "../api";
import { EarningCalendar, EarningTable } from "./state";

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
