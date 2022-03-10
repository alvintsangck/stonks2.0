import "../css/CommentForm.css";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { postCommentThunk } from "../redux/stocks/thunk";
import { RootState } from "../redux/store/state";

export default function CommentForm() {
	const dispatch = useDispatch();
	const stock = useSelector((state: RootState) => state.stock.stock);
	const [comment, setComment] = useState("");
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (stock) {
			dispatch(postCommentThunk(stock.id, comment));
			setComment("");
		}
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
