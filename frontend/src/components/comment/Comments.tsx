import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { env } from "../../env";
import { localTime } from "../../helper";
import { useLazyGetCommentsQuery, useLazyGetStockQuery } from "../../redux/stock/api";
import CommentForm from "./CommentForm";

export default function Comments() {
  const { ticker } = useParams<{ ticker: string }>();
  const [getStock, { data: stock }] = useLazyGetStockQuery();
  const [getComment, { data: comments }] = useLazyGetCommentsQuery();

  useEffect(() => {
    if (ticker) {
      getStock(ticker);
    }
  }, [getStock, ticker]);

  useEffect(() => {
    if (stock && stock.id > 0) {
      getComment(stock.id);
    }
  }, [getComment, stock]);

  return (
    <div className="comment-container">
      <h3>Comments</h3>
      <div className="comment-section">
        {comments?.map((comment, i) => (
          <div className="comment-wrap" key={i}>
            <img className="avatar" src={`${env.url}/${comment.avatar}`} alt="avatar" />
            <div className="content">
              <div>
                <span className="username">{comment.username}</span>
                <span className="comment-date">{localTime(comment.createdAt)}</span>
              </div>
              <div className="content">{comment.content}</div>
            </div>
          </div>
        ))}
      </div>
      <CommentForm />
    </div>
  );
}
