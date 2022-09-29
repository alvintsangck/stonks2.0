import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "../../css/Sidebar.css";
import { useAddWatchlistMutation, useDeleteWatchlistMutation } from "../../redux/watchlist/api";
import AddForm from "../AddForm";

type Props = {
  lists: any[] | undefined;
  currentListId: number;
};

function Sidebar({ lists, currentListId }: Props) {
  const navigate = useNavigate();
  const [addWatchlist] = useAddWatchlistMutation();
  const [deleteWatchlist] = useDeleteWatchlistMutation();

  if (lists) {
    return (
      <>
        <AddForm
          name="My Lists"
          placeholder="watchlist"
          onAdd={(name) => {
            addWatchlist(name);
          }}
        />
        <div className="section">
          {lists.length > 0 &&
            lists.map((list) => (
              <div key={list.id} className={list.id === currentListId ? "selected" : ""}>
                <div
                  onClick={() => {
                    navigate(`/watchlist/${list.id}`);
                  }}
                >
                  <span>{list.name}</span>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faTimes as IconProp}
                    onClick={() => {
                      deleteWatchlist(list.id);
                      if (currentListId === list.id) {
                        navigate(`/watchlist/${lists[0].id}`);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </>
    );
  }
  return <></>;
}

export default Sidebar;
