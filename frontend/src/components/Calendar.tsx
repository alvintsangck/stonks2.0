import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "../css/Calendar.css";
import {
  EarningTable,
  useGetAllEarningsQuery,
  useGetNextEarningTablesQuery,
  useGetPastEarningTablesQuery,
  useGetTodayEarningTablesQuery
} from "../redux/calendar/api";
import EarningsTable from "./EarningsTable";

export default function Calendar() {
  const navigate = useNavigate();
  const { data: allEarnings } = useGetAllEarningsQuery();
  const { data: todayEarnings } = useGetTodayEarningTablesQuery();
  const { data: pastEarnings } = useGetPastEarningTablesQuery();
  const { data: nextEarnings } = useGetNextEarningTablesQuery();

  const earningCalendar = allEarnings?.map(({ createdAt, ticker, releaseTime }) => ({
    date: createdAt,
    title: `${ticker} (${releaseTime})`,
    allDay: true,
  }));
  const todayEarningTable = todayEarnings?.map(mapEarningTable);
  const pastEarningTable = pastEarnings?.map(mapEarningTable);
  const nextEarningTable = nextEarnings?.map(mapEarningTable);

  function mapEarningTable(
    {
      createdAt,
      ticker,
      name,
      year,
      quarter,
      epsEstimated,
      epsReported,
      revenueEstimated,
      revenueReported,
    }: EarningTable,
    i: number
  ) {
    const epsSurprise = epsReported
      ? ((Number(epsReported) - Number(epsEstimated)) / Number(epsEstimated)) * 100
      : null;
    const revenueSurprise = revenueReported
      ? ((Number(revenueReported) - Number(revenueEstimated)) / Number(revenueEstimated)) * 100
      : null;
    return (
      <tr key={i} onClick={() => navigate(`/stocks/${ticker}`)}>
        <td className={""}>{createdAt.split("T")[0]}</td>
        <td className={""}>{ticker}</td>
        <td className={""}>{name}</td>
        <td className={"number"}>{year}</td>
        <td className={"number"}>{quarter}</td>
        <td className={"number"}>{epsEstimated}</td>
        <td className={"number"}>{epsReported}</td>
        <td className={"number " + (epsSurprise && epsSurprise > 0 ? "positive" : "negative")}>
          {epsSurprise !== null && epsSurprise.toFixed(2) + "%"}
        </td>
        <td className={"number"}>{Number(revenueEstimated).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        <td className={"number"}>
          {revenueReported ? Number(revenueReported).toLocaleString(undefined, { minimumFractionDigits: 2 }) : null}
        </td>
        <td className={"number " + (revenueSurprise && revenueSurprise > 0 ? "positive" : "negative")}>
          {revenueSurprise !== null && revenueSurprise.toFixed(2) + "%"}
        </td>
      </tr>
    );
  }

  return (
    <>
      <Helmet>
        <title>Calendar | Stonks</title>
      </Helmet>
      <Container>
        <div className="calendar">
          <FullCalendar
            plugins={[dayGridPlugin]}
            events={earningCalendar}
            eventClick={(event) => {
              const ticker = event.event.title.split("(")[0];
              navigate(`/stocks/${ticker}`);
            }}
          />
        </div>
      </Container>
      <Container fluid className="calendar-container">
        <h4>Today's Earnings Releases</h4>
        <EarningsTable contents={todayEarningTable} />
        <h4>Earnings Releases in the past 10 days</h4>
        <EarningsTable contents={pastEarningTable} />
        <h4>Upcoming Earning Releases in the next 10 days</h4>
        <EarningsTable contents={nextEarningTable} />
      </Container>
    </>
  );
}
