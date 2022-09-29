import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/CommentForm.css";
import { useLazyGetStockQuery, usePostCommentMutation } from "../../redux/stock/api";
import { RootState } from "../../redux/store/state";

export default function CommentForm() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { ticker } = useParams<{ ticker: string }>();
  const [getStock, { data: stock }] = useLazyGetStockQuery();
  const [postComment] = usePostCommentMutation();
  const [content, setContent] = useState("");

  function onSubmit(e: any) {
    e.preventDefault();
    if (stock) {
      postComment({ stockId: stock.id, content });
      setContent("");
    }
  }

  useEffect(() => {
    if (ticker) {
      getStock(ticker);
    }
  }, [getStock, ticker]);

  return (
    <Form onSubmit={onSubmit} id="comment-form">
      <Form.Control
        as="textarea"
        placeholder={user ? "Enter comment here..." : "Please login to send comment"}
        maxLength={200}
        readOnly={user === null}
        name="comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onClick={(e) => !user && navigate("/login")}
        onKeyUp={(e) => e.key === "Enter" && onSubmit(e)}
      />
      <Form.Group>
        <span className="comment-count">0</span>
        <span>/200</span>
        <button className="" type="submit">
          <FontAwesomeIcon icon={faPaperPlane as IconProp} />
        </button>
      </Form.Group>
    </Form>
  );
}
