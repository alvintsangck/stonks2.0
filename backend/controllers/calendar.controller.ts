import express, { Request } from "express";
import { CalendarService } from "../services/calendar.service";
import { wrapControllerMethod } from "../util/helper";

export class CalendarController {
	constructor(private calendarService: CalendarService) {
		this.router.post("/calendar/now", wrapControllerMethod(this.getTodayEarnings));
		this.router.post("/calendar/past", wrapControllerMethod(this.getPastTenDaysEarnings));
		this.router.post("/calendar/next", wrapControllerMethod(this.getNextTenDaysEarnings));
	}

	router = express.Router();

	getTodayEarnings = async (req: Request) => {
		const earnings = await this.calendarService.getTodayEarnings();
		return { earnings };
	};

	getPastTenDaysEarnings = async (req: Request) => {
		const earnings = await this.calendarService.getPastTenDaysEarnings();
		return { earnings };
	};

	getNextTenDaysEarnings = async (req: Request) => {
		const earnings = await this.calendarService.getNextTenDaysEarnings();
		return { earnings };
	};
}
