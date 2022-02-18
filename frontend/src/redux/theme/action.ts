export const toggleThemeAction = (theme: string) => ({ type: "@@Theme/toggle" as const, theme });

export type ThemeAction = ReturnType<typeof toggleThemeAction>;
