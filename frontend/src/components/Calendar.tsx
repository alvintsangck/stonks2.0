import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Container } from "react-bootstrap";

export default function Calendar() {
	return (
		<Container>
			<FullCalendar plugins={[dayGridPlugin]} />;
		</Container>
	);
}
