import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../css/CommentForm.css";

export default function CommentForm() {
	const [comment, setComment] = useState("");

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<Form onSubmit={onSubmit} id="comment-form">
			<Form.Group>
				<NavLink to="/login">
					<Form.Control as="textarea" disabled placeholder="Please login to send comment" />
				</NavLink>
				<Form.Control
					as="textarea"
					placeholder="Enter comment here..."
					maxLength={200}
					name="comment"
					onChange={(e) => setComment(e.target.value)}
				/>
			</Form.Group>
			<Form.Group>
				<span className="comment-count">0</span>
				<span>/200</span>
				<button className="" type="submit">
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</Form.Group>
		</Form>
	);
}
