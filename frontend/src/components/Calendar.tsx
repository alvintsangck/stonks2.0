import "../css/Calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { useEffect } from "react";
import { getAllEarningsThunk, getEarningsTableThunk } from "../redux/calendar/thunk";
import StockTable from "./StockTable";
import { EarningTable } from "../redux/calendar/state";

export default function Calendar() {
	const dispatch = useDispatch();
	const allEarnings = useSelector((state: RootState) => state.calendar.all);
	const todayEarnings = useSelector((state: RootState) => state.calendar.today);
	const pastEarnings = useSelector((state: RootState) => state.calendar.past);
	const nextEarnings = useSelector((state: RootState) => state.calendar.next);
	console.log(pastEarnings);
	
	useEffect(() => {
		dispatch(getAllEarningsThunk());
		dispatch(getEarningsTableThunk());
	}, [dispatch]);

	const earningCalendar = allEarnings.map(({ createdAt, ticker, releaseTime }) => ({
		date: createdAt,
		title: `${ticker} (${releaseTime})`,
		allDay: true,
	}));
	const todayEarningTable = todayEarnings.map(mapEarningTable);
	const pastEarningTable = pastEarnings.map(mapEarningTable);
	const nextEarningTable = nextEarnings.map(mapEarningTable);
	const tableHeadings = [
		"date",
		"ticker",
		"company",
		"year",
		"quarter",
		"EPS estimated",
		"EPS reported",
		"EPS surprise",
		"Revenue Estimated (Mil)",
		"Revenue Reported (Mil)",
		"Revenue surprise",
	];

	return (
		<>
			<Container>
				<div className="calendar">
					<FullCalendar plugins={[dayGridPlugin]} events={earningCalendar} />
				</div>
			</Container>
			<Container fluid className="calendar-container">
				<h4>Today's Earnings Releases</h4>
				<StockTable headings={tableHeadings} contents={todayEarningTable} isLoading={false} />
				<h4>Earnings Releases in the past 10 days</h4>
				<StockTable headings={tableHeadings} contents={pastEarningTable} isLoading={false} />
				<h4>Upcoming Earning Releases in the next 10 days</h4>
				<StockTable headings={tableHeadings} contents={nextEarningTable} isLoading={false} />
			</Container>
		</>
	);
}

function mapEarningTable({
	createdAt,
	ticker,
	name,
	year,
	quarter,
	epsEstimated,
	epsReported,
	revenueEstimated,
	revenueReported,
}: EarningTable): EarningTable {
	return {
		createdAt: createdAt.split("T")[0],
		ticker,
		name,
		year,
		quarter,
		epsEstimated,
		epsReported,
		epsSurprise: epsReported
			? (((Number(epsReported) - Number(epsEstimated)) / Number(epsEstimated)) * 100).toFixed(2) + "%"
			: null,
		revenueEstimated: Number(revenueEstimated).toLocaleString(undefined, { minimumFractionDigits: 2 }),
		revenueReported: revenueReported
			? Number(revenueReported).toLocaleString(undefined, { minimumFractionDigits: 2 })
			: null,
		revenueSurprise: revenueReported
			? (((Number(revenueReported) - Number(revenueEstimated)) / Number(revenueEstimated)) * 100).toFixed(2) + "%"
			: null,
	};
}
