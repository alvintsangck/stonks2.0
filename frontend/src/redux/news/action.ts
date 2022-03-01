import { News } from "./state";

export const getNewsAction = (news: News[]) => ({
	type: "@@/News/get" as const,
	news,
});

export type NewsAction = ReturnType<typeof getNewsAction>;
