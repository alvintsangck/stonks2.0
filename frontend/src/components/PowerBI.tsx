import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import "../css/PowerBI.css";

export default function PowerBI() {
  return (
    <div className="power-bi">
      <Helmet>
        <title>Dashboard | Stonks</title>
      </Helmet>
      <Container fluid>
        <iframe
          title="stonks dashboard - treasury rates"
          width="100%"
          height="800px"
          src="https://app.powerbi.com/view?r=eyJrIjoiMjVkYjE0ZjEtOTY0Yy00ZThkLWIyNTYtMDY0Njc4YzI0NzRmIiwidCI6ImNhYjQzNjA3LWI1MjEtNDZhZi04NTJkLWVkM2UxZDFkZDVjYSIsImMiOjEwfQ%3D%3D"
          frameBorder="0"
          allowFullScreen={true}
        />
      </Container>
    </div>
  );
}
