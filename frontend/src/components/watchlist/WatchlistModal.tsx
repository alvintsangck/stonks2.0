import { useState } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../../css/WatchlistModal.css";
import { useAddStockMutation, useGetWatchlistsQuery } from "../../redux/watchlist/api";

type Props = {
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
};

export default function WatchlistModal({ isShow, setIsShow }: Props) {
  const { data: watchlists } = useGetWatchlistsQuery();
  const [watchlistId, setWatchlistId] = useState(0);
  const [addStock] = useAddStockMutation();
  const hideModal = () => setIsShow(false);
  const { ticker } = useParams<{ ticker: string }>();

  return (
    <Modal show={isShow} onHide={hideModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add to Watchlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {watchlists &&
            watchlists?.length > 0 &&
            watchlists.map(({ id, name }) => (
              <ListGroup.Item
                className={watchlistId === id ? "active" : ""}
                onClick={() => setWatchlistId(id)}
                key={id}
              >
                {name}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="stonk-btn trade-btn"
          onClick={() => {
            addStock({ watchlistId, ticker: ticker ?? "" });
            setWatchlistId(0);
            setIsShow(false);
          }}
        >
          Add
        </button>
      </Modal.Footer>
    </Modal>
  );
}
