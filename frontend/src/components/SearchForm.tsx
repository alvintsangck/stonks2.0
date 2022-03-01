import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { push } from "connected-react-router";
import { FormEvent, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import "../css/SearchForm.css";

export function SearchForm() {
	const [symbol, setSymbol] = useState("");
	const dispatch = useDispatch();

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(push(`/stocks/${symbol}`));
	};

	return (
		<Form onSubmit={onSubmit} className="search-form">
			<Form.Group>
				<Form.Control
					type="search"
					placeholder="Enter a symbol"
					name="tickerInput"
					value={symbol}
					onChange={(e) => setSymbol(e.target.value.toUpperCase())}
				/>
			</Form.Group>
			<button type="submit" className="form-control search-btn">
				<FontAwesomeIcon icon={faSearch} className="" />
			</button>
		</Form>
	);
}
