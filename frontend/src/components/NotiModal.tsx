import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

type Props = {
	isShow: boolean;
	setIsShow: (isShow: boolean) => void;
};

export default function BuyModal({ isShow, setIsShow }: Props) {
	const dispatch = useDispatch();
	const { ticker } = useParams<{ ticker: string }>();

	const hideModal = () => setIsShow(false);

	return (
		<Modal show={isShow} onHide={hideModal} centered>
			<Modal.Header>Notification {ticker}</Modal.Header>
			<Modal.Body>Price</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={hideModal}>
					Close
				</Button>
				<Button variant="primary" onClick={() => dispatch}>
					Add
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
