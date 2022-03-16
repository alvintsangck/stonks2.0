import { Container } from "react-bootstrap";
import "../css/PowerBI.css";

export default function PowerBI() {
	return (
		<div className="power-bi">
			<Container fluid>
				<iframe
					title="sentiment indicators"
					width="1140"
					height="541.25"
					src="https://app.powerbi.com/reportEmbed?reportId=d280ee63-32f4-428e-8e7c-ef01c70aa9f2&autoAuth=true&ctid=1cfbbd60-25f0-455a-976f-dfc4d172b5b9&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWVhc3QtYXNpYS1iLXByaW1hcnktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D"
					frameBorder="0"
					allowFullScreen={true}
				></iframe>
			</Container>
		</div>
	);
}
