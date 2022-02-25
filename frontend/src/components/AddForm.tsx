import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { Form } from "react-bootstrap";
import "../css/AddForm.css";

type Props = {
	name: string;
	placeholder: string;
};

function AddForm({ name, placeholder }: Props) {
	const [content, setContent] = useState("");
	const [isRotate, setIsRotate] = useState(false);

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setContent("");
	};

	return (
		<>
			<div className="form-heading">
				<h2>{name}</h2>
				<FontAwesomeIcon
					className={isRotate ? "rotate" : ""}
					icon={faPlus}
					onClick={() => setIsRotate(!isRotate)}
				/>
			</div>
			<Form onSubmit={onSubmit} className="add-form">
				<Form.Control type="text" placeholder={`add ${placeholder}`} />
				<button className="submit-btn" type="submit">
					Add
				</button>
			</Form>
		</>
	);
}

export default AddForm;
