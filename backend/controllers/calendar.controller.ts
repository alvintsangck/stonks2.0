import express, { Request } from "express";
import { EarningCalendar, EarningTable } from "../models/enum/Calendar";
import { EarningTimeFrame } from "../models/enum/earningTimeFrame";
import { CalendarService } from "../services/calendar.service";
import { wrapControllerMethod } from "../util/helper";

export class CalendarController {
  constructor(private calendarService: CalendarService) {
    this.router.get("/calendar/earnings/:timeFrame", wrapControllerMethod(this.getEarnings));
  }

  router = express.Router();

  getEarnings = async (req: Request): Promise<{ earnings: Array<EarningCalendar | EarningTable> }> => {
    const timeFrame = req.params.timeFrame;

    switch (timeFrame) {
      case EarningTimeFrame.ALL: {
        const earnings = await this.calendarService.getAllEarnings();
        return { earnings };
      }
      case EarningTimeFrame.PAST: {
        const earnings = await this.calendarService.getTodayEarnings();
        return { earnings };
      }
      case EarningTimeFrame.NOW: {
        const earnings = await this.calendarService.getPastTenDaysEarnings();
        return { earnings };
      }
      case EarningTimeFrame.NEXT: {
        const earnings = await this.calendarService.getNextTenDaysEarnings();
        return { earnings };
      }
      default:
        return { earnings: [] };
    }
  };
}
