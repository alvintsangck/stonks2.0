import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { News } from "./state";

export const newsApi = createApi({
	reducerPath: "newsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "",
		headers: {
			"x-rapidapi-host": "seeking-alpha.p.rapidapi.com",
			"x-rapidapi-key": "eb76c9b688msha0363b0bcc4e8d8p1f0147jsn4c17370cbe91",
		},
	}),
	endpoints: (builder) => ({
		getNews: builder.query<News[], void>({
			query: () => "https://seeking-alpha.p.rapidapi.com/news/v2/list-trending?until=0&since=0&size=7",
		}),
	}),
});

export const { useGetNewsQuery } = newsApi;
