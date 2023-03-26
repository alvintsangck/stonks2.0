import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch } from "react";
import { ButtonGroup, Col, Form, ListGroup, Row, ToggleButton } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import { useGetIndustriesQuery, useGetSectorsQuery } from "../../redux/screener/api";
import { addItem, removeItem, resetItem } from "../../redux/screener/slice";
import { Item, ScreenerItemOptions, ScreenerStateKey } from "../../redux/screener/state";
import "../css/ScreenerItem.css";

type Props = {
  radioIndustry: ScreenerItemOptions;
  radioSector: ScreenerItemOptions;
  setRadioIndustry: Dispatch<ScreenerItemOptions>;
  setRadioSector: Dispatch<ScreenerItemOptions>;
};

export default function ScreenerItem({ radioIndustry, radioSector, setRadioIndustry, setRadioSector }: Props) {
  const dispatch = useAppDispatch();
  const { data: sectors } = useGetSectorsQuery();
  const { data: industries } = useGetIndustriesQuery();
  const addedSectors = useAppSelector((state) => state.screener.addedSectors);
  const addedIndustries = useAppSelector((state) => state.screener.addedIndustries);
  const radioButtons = [
    { value: ScreenerItemOptions.Include, className: "outline-success" },
    { value: ScreenerItemOptions.Exclude, className: "outline-danger" },
  ];

  function addSector(sector: Item) {
    if (addedSectors.filter((addedSector) => addedSector.id === sector.id).length === 0)
      dispatch(addItem({ key: ScreenerStateKey.AddedSectors, item: sector, value: radioSector }));
  }

  function addIndustry(industry: Item) {
    if (addedIndustries.filter((addedIndustry) => addedIndustry.id === industry.id).length === 0)
      dispatch(addItem({ key: ScreenerStateKey.AddedIndustries, item: industry, value: radioIndustry }));
  }

  function resetSector(e: any) {
    setRadioSector(ScreenerItemOptions.Include);
    dispatch(resetItem(ScreenerStateKey.AddedSectors));
  }

  function resetIndustry(e: any) {
    setRadioIndustry(ScreenerItemOptions.Include);
    dispatch(resetItem(ScreenerStateKey.AddedIndustries));
  }

  return (
    <Row>
      <Col md={6}>
        <div className="stonk-btn-container">
          <h4>Sector</h4>
          <ButtonGroup>
            {radioButtons.map((btn) => (
              <ToggleButton
                key={btn.value}
                type="radio"
                value={btn.value}
                variant={btn.className}
                name="sector"
                checked={radioSector === btn.value}
                onClick={() => setRadioSector(btn.value)}
              >
                {btn.value[0].toUpperCase() + btn.value.substring(1, btn.value.length)}
              </ToggleButton>
            ))}
            <button className="stonk-btn reset-btn" onClick={resetSector}>
              Reset
            </button>
          </ButtonGroup>
        </div>
        <Form.Group className="screener-items">
          <ListGroup className="screen-list">
            {sectors?.map((sector) => (
              <ListGroup.Item key={sector.id} onClick={() => addSector(sector)}>
                {sector.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <FontAwesomeIcon icon={faArrowRight as IconProp} />
          <ListGroup className="screen-list">
            {addedSectors.map((sector, i) => (
              <ListGroup.Item
                key={i}
                variant={sector.isInclude ? "success" : "danger"}
                onClick={() => dispatch(removeItem({ key: ScreenerStateKey.AddedSectors, item: sector }))}
              >
                {sector.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form.Group>
      </Col>
      <Col md={6}>
        <div className="stonk-btn-container">
          <h4>Industry</h4>
          <ButtonGroup>
            {radioButtons.map((btn) => (
              <ToggleButton
                key={btn.value}
                type="radio"
                value={btn.value}
                variant={btn.className}
                name="industry"
                checked={radioIndustry === btn.value}
                onClick={() => setRadioIndustry(btn.value)}
              >
                {btn.value[0].toUpperCase() + btn.value.substring(1, btn.value.length)}
              </ToggleButton>
            ))}
            <button className="stonk-btn reset-btn" onClick={resetIndustry}>
              Reset
            </button>
          </ButtonGroup>
        </div>
        <Form.Group className="screener-items">
          <ListGroup className="screen-list">
            {industries?.map((industry) => (
              <ListGroup.Item key={industry.id} onClick={() => addIndustry(industry)}>
                {industry.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <FontAwesomeIcon icon={faArrowRight as IconProp} />
          <ListGroup className="screen-list">
            {addedIndustries.map((industry, i) => (
              <ListGroup.Item
                key={i}
                variant={industry.isInclude ? "success" : "danger"}
                onClick={() => dispatch(removeItem({ key: ScreenerStateKey.AddedIndustries, item: industry }))}
              >
                {industry.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form.Group>
      </Col>
    </Row>
  );
}
