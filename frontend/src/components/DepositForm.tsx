import "../css/TransferForm.css";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/state";
import { useForm } from "react-hook-form";
import { depositThunk } from "../redux/metaMask/thunk";

type FormState = {
	deposit: string;
};

export default function TransferForm() {
	const dispatch = useDispatch();
	const balance = useSelector((state: RootState) => state.metaMask.balance);
	const { watch, handleSubmit, register, reset, setValue } = useForm<FormState>({ defaultValues: { deposit: "0" } });

	function onSubmit(data: FormState) {
		dispatch(depositThunk(data.deposit));
		reset();
	}

	function validateValue(e: any) {
		const value = Number(e.target.value);
		if (value <= 0) setValue("deposit", "0");
		if (value >= balance) setValue("deposit", balance.toString());
	}

	return (
		<Form id="transfer-form" onSubmit={handleSubmit(onSubmit)}>
			<Form.Group>Token Available for deposit: {balance} STONK</Form.Group>
			<Form.Group>
				<Form.Label>Deposit Amount</Form.Label>
			</Form.Group>
			<Form.Group className="transfer-input">
				<Form.Control type="number" {...register("deposit")} min="0" max={balance} onBlur={validateValue} />
				<span>STONK</span>
			</Form.Group>
			<Form.Group>
				<span>= {Number(watch("deposit")) > 0 ? watch("deposit") : 0} USD</span>
			</Form.Group>
			<button className="stonk-btn" type="submit">
				Deposit
			</button>
		</Form>
	);
}
