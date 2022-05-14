// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { CalendarState, EarningCalendar, EarningTables } from "./state";

// const initialState: CalendarState = {
// 	all: [],
// 	today: [],
// 	past: [],
// 	next: [],
// };

// export const calendarSlice = createSlice({
// 	name: "calendar",
// 	initialState,
// 	reducers: {
// 		earningCalendar: (state, action: PayloadAction<EarningCalendar[]>) => {
// 			state.all = action.payload;
// 		},
// 		earningTables: (state, action: PayloadAction<EarningTables>) => {
// 			state.past = action.payload.past;
// 			state.today = action.payload.today;
// 			state.next = action.payload.next;
// 		},
// 	},
// });

// export const { earningCalendar, earningTables } = calendarSlice.actions;
