import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { News } from "./state";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
      headers.set("X-RapidAPI-Host", "seeking-alpha.p.rapidapi.com");
      headers.set("X-RapidAPI-Key", "75991559c7mshffbcf207c4b5b5fp14af29jsnf833c0b7551e");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getNews: builder.query<News[], void>({
      query: () => "https://seeking-alpha.p.rapidapi.com/news/v2/list-trending?until=0&since=0&size=7",
      transformResponse: (res: { data: News[] }) => res.data,
    }),
  }),
});

export const { useGetNewsQuery } = newsApi;
