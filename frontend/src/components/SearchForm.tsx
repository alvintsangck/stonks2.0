import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/SearchForm.css";

export function SearchForm() {
	const [ticker, setTicker] = useState("");
	const navigate = useNavigate();

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		navigate(`/stocks/${ticker}`);
		setTicker("");
	};

	return (
		<Form onSubmit={onSubmit} className="search-form">
			<Form.Control
				type="search"
				placeholder="Enter a symbol"
				name="tickerInput"
				value={ticker}
				onChange={(e) => setTicker(e.target.value.toUpperCase())}
			/>
			<button type="submit" className="search-btn">
				<FontAwesomeIcon icon={faSearch as IconProp} className="" />
			</button>
		</Form>
	);
}
