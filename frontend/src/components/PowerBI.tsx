import { Container } from "react-bootstrap";
import "../css/PowerBI.css";

export default function PowerBI() {
	return (
		<div className="power-bi">
			<Container fluid>
				<iframe
					title="sentiment indicators"
					width="100%"
					height="800px"
					src="https://app.powerbi.com/reportEmbed?reportId=24374ca4-97cb-45f6-a916-0bab0bd1aaa3&autoAuth=true&ctid=1cfbbd60-25f0-455a-976f-dfc4d172b5b9&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWVhc3QtYXNpYS1iLXByaW1hcnktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D"
					frameBorder="0"
					allowFullScreen={true}
				/>
			</Container>
		</div>
	);
}
