import { push } from "connected-react-router";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { env } from "../env";

export default function NoMatch() {
	const dispatch = useDispatch();

	useEffect(() => {
		setTimeout(() => {
			dispatch(push("/"));
		}, 3000);
	}, [dispatch]);

	return (
		<Container>
			<h3>This page is not stonks.</h3>
			<h4>Redirecting in 2 seconds...</h4>
			<img src={`${env}/NOT_STONK.png`} alt="not stonk"></img>
		</Container>
	);
}
