import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Container } from "react-bootstrap";

export default function Calendar() {
	return (
		<Container>
			<FullCalendar
				plugins={[dayGridPlugin]}
				events={[
					{ title: "test1", date: "2022-03-01" },
					{ title: "showcase", date: "2022-03-17" },
				]}
			/>
		</Container>
	);
}
