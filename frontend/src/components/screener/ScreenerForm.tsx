import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import { resetScreenerForm } from "../../redux/screener/slice";
import { IScreener, ScreenerItemOptions } from "../../redux/screener/state";
import "../css/ScreenerForm.css";
import ScreenerItem from "./ScreenerItem";

export type ScreenerFormState = {
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

type Input = {
  title: string;
  name: string;
  min: number;
  max: number;
};

type Props = {
  loadScreener: Function;
  stocks: IScreener[] | undefined;
};

export default function ScreenerForm({ loadScreener, stocks }: Props) {
  const dispatch = useAppDispatch();
  const addedIndustries = useAppSelector((state) => state.screener.addedIndustries);
  const addedSectors = useAppSelector((state) => state.screener.addedSectors);
  const [radioSector, setRadioSector] = useState(ScreenerItemOptions.Include);
  const [radioIndustry, setRadioIndustry] = useState(ScreenerItemOptions.Include);
  const defaultValues = {
    minPrice: 0,
    maxPrice: 1000000,
    minWeekPercent: 0,
    maxWeekPercent: 100,
    minMarketCap: 0,
    maxMarketCap: 5000000,
    minRS: 0,
    maxRS: 100,
    minIndustryRS: 0,
    maxIndustryRS: 100,
    minIndustryRank: 1,
    maxIndustryRank: 197,
  };
  const { register, handleSubmit, reset, setValue, watch } = useForm<ScreenerFormState>({ defaultValues });
  const inputsArr: Input[][] = [
    [
      { title: "Price ($)", name: "price", min: 0, max: 1000000 },
      { title: "% Off 52-week High", name: "weekPercent", min: 0, max: 100 },
      { title: "Market Capitalization (Mil)", name: "marketCap", min: 0, max: 5000000 },
    ],
    [
      { title: "RS Rating (0-100)", name: "rS", min: 0, max: 100 },
      { title: "Industry RS Rating (0-100)", name: "industryRS", min: 0, max: 100 },
      { title: "Industry Ranking (1-197)", name: "industryRank", min: 1, max: 197 },
    ],
  ];

  function onSubmit(data: ScreenerFormState) {
    const body = {
      ...data,
      includedIndustry: addedIndustries.filter((item) => item.isInclude).map((item) => item.id),
      excludedIndustry: addedIndustries.filter((item) => !item.isInclude).map((item) => item.id),
      includedSector: addedSectors.filter((item) => item.isInclude).map((item) => item.id),
      excludedSector: addedSectors.filter((item) => !item.isInclude).map((item) => item.id),
    };
    loadScreener(body);
  }

  function validateValue(e: any) {
    const name = e.target.name as keyof ScreenerFormState;
    const value = Number(e.target.value);
    const key = name.substring(3);
    const minKey = ("min" + key) as keyof ScreenerFormState;
    const maxKey = ("max" + key) as keyof ScreenerFormState;
    const minValue = watch(minKey);
    const maxValue = watch(maxKey);
    if (value <= defaultValues[minKey]) setValue(name, defaultValues[minKey]);
    if (value >= defaultValues[maxKey]) setValue(name, defaultValues[maxKey]);
    if (name.match(/min/) && value > maxValue) setValue(name, maxValue);
    if (name.match(/max/) && value < minValue) setValue(name, minValue);
  }

  function resetForm() {
    reset();
    dispatch(resetScreenerForm());
    setRadioSector(ScreenerItemOptions.Include);
    setRadioIndustry(ScreenerItemOptions.Include);
  }

  return (
    <>
      <Form id="screener-form" onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {inputsArr.map((inputs, i) => (
            <Col lg={6} key={i}>
              {inputs.map(({ title, name, min, max }) => (
                <Form.Group className="screener-items" key={name}>
                  <h4>{title}</h4>
                  <div>
                    <Form.Control
                      {...register(`min${name[0].toUpperCase() + name.substring(1)}` as keyof ScreenerFormState, {
                        valueAsNumber: true,
                        min,
                        max,
                        onBlur: validateValue,
                      })}
                      type="number"
                      placeholder="min"
                    />
                    <span>to</span>
                    <Form.Control
                      {...register(`max${name[0].toUpperCase() + name.substring(1)}` as keyof ScreenerFormState, {
                        valueAsNumber: true,
                        min,
                        max,
                        onBlur: validateValue,
                      })}
                      type="number"
                      placeholder="max"
                    />
                  </div>
                </Form.Group>
              ))}
            </Col>
          ))}
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
          <h4>Number of stocks found: {stocks ? stocks.length : 0}</h4>
        </Col>
        <Col xs={4}>
          <button type="submit" className="stonk-btn result-btn" form="screener-form">
            View Screen Results
          </button>
        </Col>
        <Col xs={2}>
          <button className="stonk-btn result-btn" onClick={() => resetForm()}>
            Reset
          </button>
        </Col>
      </Row>
    </>
  );
}
