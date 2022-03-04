import { RootDispatch } from "../store/action";
import { getNewsAction, loadingNewsAction } from "./action";

export function getNewsThunk() {
	return async (dispatch: RootDispatch) => {
		dispatch(loadingNewsAction());
		const res = await fetch("https://seeking-alpha.p.rapidapi.com/news/v2/list-trending?until=0&since=0&size=7", {
			method: "GET",
			headers: {
				"x-rapidapi-host": "seeking-alpha.p.rapidapi.com",
				"x-rapidapi-key": "682db5aceamshb889cb938933b9bp159351jsna47daa8ade2e",
			},
		});
		const result = await res.json();
		const news = result.data;
		dispatch(getNewsAction(news));
	};
}
