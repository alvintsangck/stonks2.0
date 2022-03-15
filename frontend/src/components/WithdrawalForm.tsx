import { useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getBalanceThunk } from "../redux/auth/thunk";
import { withdrawalThunk } from "../redux/metaMask/thunk";
import { RootState } from "../redux/store/state";

type FormState = {
	withdrawal: number;
};

export default function WithdrawalForm() {
	const dispatch = useDispatch();
	const balance = useSelector((state: RootState) => state.metaMask.balance);
	const cash = useSelector((state: RootState) => state.auth.balance.cash);
	const { watch, handleSubmit, register, reset, setValue } = useForm<FormState>({
		defaultValues: { withdrawal: 0 },
	});

	function onSubmit(data: FormState) {
		dispatch(withdrawalThunk(data.withdrawal));
		reset();
	}

	function validateValue(e: any) {
		const value = Number(e.target.value);
		if (value <= 0) setValue("withdrawal", 0);
		else if (value >= balance) setValue("withdrawal", balance);
		else setValue("withdrawal", Number(value.toFixed(2)));
	}

	useEffect(() => {
		dispatch(getBalanceThunk());
	}, [dispatch]);

	return (
		<Form id="transfer-form" onSubmit={handleSubmit(onSubmit)}>
			<Row>
				<Col>
					<Form.Group>Current balance for withdrawal: {cash} USD</Form.Group>
					<Form.Group>
						<Form.Label>Withdrawal Amount</Form.Label>
					</Form.Group>
					<Form.Group className="transfer-input">
						<Form.Control
							type="number"
							{...register("withdrawal")}
							min="0"
							max={balance}
							onBlur={validateValue}
						/>
						<span>USD</span>
					</Form.Group>
					<Form.Group>
						<span>= {Number(watch("withdrawal")) > 0 ? watch("withdrawal") : 0} STONK</span>
					</Form.Group>
					<button className="stonk-btn" type="submit">
						Withdrawal
					</button>
				</Col>
			</Row>
		</Form>
	);
}
