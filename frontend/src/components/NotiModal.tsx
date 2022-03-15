import { Modal } from "react-bootstrap";
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
			<Modal.Header>Get notification of {ticker}</Modal.Header>
			<Modal.Body>in development</Modal.Body>
			<Modal.Footer>
				<button className="stonk-btn" onClick={() => dispatch}>
					Add
				</button>
			</Modal.Footer>
		</Modal>
	);
}
