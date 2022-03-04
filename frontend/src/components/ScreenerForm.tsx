import "../css/ScreenerForm.css";
import { Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loadScreenResultThunk } from "../redux/screener/thunk";
import { RootState } from "../redux/store/state";
import { resetScreenerAction } from "../redux/screener/action";
import ScreenerItem from "./ScreenerItem";
import { useState } from "react";

export type FormState = {
	minPrice: number;
	maxPrice: number;
	minWeekPercent: number;
	maxWeekPercent: number;
	minMarketCap: number;
	maxMarketCap: number;
	minRS: number;
	maxRS: number;
	minIndustryRS: number;
	maxIndustryRS: number;
	minIndustryRank: number;
	maxIndustryRank: number;
};

const defaultValues = {
	minPrice: 0,
	maxPrice: 1000000,
	minWeekPercent: 0,
	maxWeekPercent: 100,
	minMarketCap: 0,
	maxMarketCap: 5000000,
	minRS: 1,
	maxRS: 99,
	minIndustryRS: 1,
	maxIndustryRS: 99,
	minIndustryRank: 1,
	maxIndustryRank: 197,
};

export default function ScreenerForm() {
	const dispatch = useDispatch();
	const { register, handleSubmit, reset } = useForm<FormState>({ defaultValues });
	const addedIndustries = useSelector((state: RootState) => state.screener.addedIndustries);
	const addedSectors = useSelector((state: RootState) => state.screener.addedSectors);
	const [radioSector, setRadioSector] = useState("include");
	const [radioIndustry, setRadioIndustry] = useState("include");
	const onSubmit = (data: FormState) => {
		dispatch(loadScreenResultThunk(data, addedIndustries, addedSectors));
	};

	function resetForm() {
		reset();
		dispatch(resetScreenerAction());
		setRadioSector("include");
		setRadioIndustry("include");
	}

	return (
		<>
			<Form id="screener-form" onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<Col lg={6}>
						<Form.Group className="screener-items">
							<h4>Price ($)</h4>
							<div>
								<Form.Control
									{...register("minPrice")}
									type="number"
									placeholder="min"
									min="0"
									max="1000000"
								></Form.Control>
								<span>to</span>
								<Form.Control
									{...register("maxPrice")}
									type="number"
									placeholder="max"
									min="0"
									max="1000000"
								></Form.Control>
							</div>
						</Form.Group>
						<Form.Group className="screener-items">
							<h4>% Off 52-week High</h4>
							<div>
								<Form.Control
									{...register("minWeekPercent")}
									type="number"
									placeholder="min"
									min="0"
									max="100"
								></Form.Control>
								<span>to</span>
								<Form.Control
									{...register("maxWeekPercent")}
									type="number"
									placeholder="max"
									min="0"
									max="100"
								></Form.Control>
							</div>
						</Form.Group>
						<Form.Group className="screener-items">
							<h4>Market Capitalization (Mil)</h4>
							<div>
								<Form.Control
									{...register("minMarketCap")}
									type="number"
									placeholder="min"
									min="0"
									max="5000000"
								></Form.Control>
								<span>to</span>
								<Form.Control
									{...register("maxMarketCap")}
									type="number"
									placeholder="max"
									min="0"
									max="5000000"
								></Form.Control>
							</div>
						</Form.Group>
					</Col>
					<Col lg={6}>
						<Form.Group className="screener-items">
							<h4>RS Rating (1-99)</h4>
							<div>
								<Form.Control
									{...register("minRS")}
									type="number"
									placeholder="min"
									min="0"
									max="100"
								/>
								<span>to</span>
								<Form.Control
									{...register("maxRS")}
									type="number"
									placeholder="max"
									min="0"
									max="100"
								/>
							</div>
						</Form.Group>
						<Form.Group className="screener-items">
							<h4>Industry RS Rating (1-99)</h4>
							<div>
								<Form.Control
									{...register("minIndustryRS")}
									type="number"
									placeholder="min"
									min="0"
									max="100"
								/>
								<span>to</span>
								<Form.Control
									{...register("maxIndustryRS")}
									type="number"
									placeholder="max"
									min="0"
									max="100"
								/>
							</div>
						</Form.Group>
						<Form.Group className="screener-items">
							<h4>Industry Ranking (1-197)</h4>
							<div>
								<Form.Control
									{...register("minIndustryRank")}
									type="number"
									placeholder="min"
									min="1"
									max="197"
								/>
								<span>to</span>
								<Form.Control
									{...register("maxIndustryRank")}
									type="number"
									placeholder="max"
									min="1"
									max="197"
								/>
							</div>
						</Form.Group>
					</Col>
				</Row>
			</Form>
			<ScreenerItem
				radioIndustry={radioIndustry}
				radioSector={radioSector}
				setRadioIndustry={setRadioIndustry}
				setRadioSector={setRadioSector}
			/>
			<Row className="screen-result">
				<Col xs={6}>
					<h4>Number of stocks found:</h4>
				</Col>
				<Col xs={3}>
					<button type="submit" className="screener-btn result-btn" form="screener-form">
						View Screen Results
					</button>
				</Col>
				<Col xs={3}>
					<button className="screener-btn result-btn" onClick={() => resetForm()}>
						Reset
					</button>
				</Col>
			</Row>
		</>
	);
}
