import { Stock, StockNews, UserComment } from "./state";

export const getStockAction = (stock: Stock) => ({
	type: "@@Stock/get_stock" as const,
	stock,
});

export const getCommentsAction = (comments: UserComment[]) => ({
	type: "@@Stock/get_comments" as const,
	comments,
});

export const postCommentAction = (comment: UserComment) => ({
	type: "@@Stock/post_comment" as const,
	comment,
});

export const getStockNewsAction = (news: StockNews[]) => ({
	type: "@@Stock/get_news" as const,
	news,
});

export type StockAction =
	| ReturnType<typeof getStockAction>
	| ReturnType<typeof getCommentsAction>
	| ReturnType<typeof postCommentAction>
	| ReturnType<typeof getStockNewsAction>;
