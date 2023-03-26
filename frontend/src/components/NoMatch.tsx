import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { env } from "../util/env";

export default function NoMatch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 5000);
  }, [dispatch, navigate]);

  return (
    <Container>
      <h3>This page is not stonks.</h3>
      <h4>Redirecting to homepage in 5 seconds...</h4>
      <img src={`${env.url}/NOT_STONK.png`} alt="not stonk"></img>
    </Container>
  );
}
