import "../css/CommentForm.css";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { postCommentThunk } from "../redux/stock/thunk";
import { RootState } from "../redux/store/state";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useNavigate } from "react-router-dom";

export default function CommentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stock = useSelector((state: RootState) => state.stock.stock);
  const user = useSelector((state: RootState) => state.auth.user);
  const [comment, setComment] = useState("");

  async function onSubmit(e: any) {
    e.preventDefault();
    if (stock) {
      dispatch(postCommentThunk(stock.id, comment) as any);
      setComment("");
    }
  }

  return (
    <Form onSubmit={onSubmit} id="comment-form">
      <Form.Control
        as="textarea"
        placeholder={user ? "Enter comment here..." : "Please login to send comment"}
        maxLength={200}
        readOnly={user === null}
        name="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onClick={(e) => !user && navigate("/login")}
        onKeyUp={(e) => e.key === "Enter" && onSubmit(e)}
      />
      <Form.Group>
        <span className="comment-count">0</span>
        <span>/200</span>
        <button className="" type="submit">
          (<FontAwesomeIcon icon={faPaperPlane as IconProp} />)
        </button>
      </Form.Group>
    </Form>
  );
}
