import React from "react";
import Slider from "components/Slider";
import { Col, Row } from "react-bootstrap";
import { useState } from "react";
import image1 from "assets/svg/standing-up-man-1.svg";
import image2 from "assets/svg/standing-man2.svg";
import image3 from "assets/svg/standing-man3.svg";
import "./styles.scss";
const SliderBar = () => {
  const [objective, setObjective] = useState({
    progressStatus: 0,
  });
  const value1 = Number(objective.progressStatus) / 10 - 1
  const value = Math.round(value1);
  const handleChangeSearch = ({ target: { name, value, label } }) => {
    let updatedData = { ...objective };
    updatedData[name] = value;
    setObjective(updatedData);
  };
  //const variantColor = () => {
  //  let color = "danger";
  //  if (objective.progressStatus > 0 && objective.progressStatus <= 60) {
  //    color = "danger";
  //  } else if (
  //    objective.progressStatus > 60 &&
  //    objective.progressStatus <= 80
  //  ) {
  //    color = "warning";
  //  } else if (objective.progressStatus > 80) {
  //    color = "success";
  //  }
  //  return color;
  //};
  return (
    <div>
      <div>
        <Row className="rowstyles">
          <Col md={1} className="mr-1">
            <img src={image1} height={90} alt="slider" />
          </Col>
          <Col md={1} className="mr-1">
            <img src={image1} height={90} alt="slider" />
          </Col>
          <Col md={1} className="mr-1">
            <img src={image1} height={90} alt="slider" />
          </Col>
          <Col md={1} className="mr-1">
            <img src={image1} height={90} alt="slider" />
          </Col>
          <Col md={1} className="mr-1">
            <img src={image1} height={90} alt="slider" />
          </Col>
          <Col md={1} className="mr-1">
            <img src={image2} height={90} alt="slider" />
          </Col>
          <Col md={1} className="mr-1">
            <img src={image2} height={90} alt="slider" />
          </Col>
          <Col md={1} className="mr-1">
            <img src={image3} height={90} alt="slider" />
          </Col>
          <Col md={1} className="mr-1">
            <img src={image3} height={90} alt="slider" />
          </Col>
          <Col md={1} className="mr-1">
            <img src={image3} height={90} alt="slider" />
          </Col>
        </Row>
        {/* <span className={`text-${variantColor()}`}>
          {value}
        </span> */}
        <div>
          <Row className="rowstyles2">
            <Col md={1} className="mr-2" style={{ backgroundColor: value === 0 ? "grey" : "", borderRadius: "20px", }}>
              <span>0</span>
            </Col>{" "}
            <Col md={1} className="mr-1" style={{ backgroundColor: value === 1 ? "grey" : "", borderRadius: "20px", }}>
              <span>1</span>
            </Col>{" "}
            <Col md={1} className="mr-1" style={{ backgroundColor: value === 2 ? "grey" : "", borderRadius: "20px", }}>
              <span>2</span>
            </Col>{" "}
            <Col md={1} className="mr-1" style={{ backgroundColor: value === 3 ? "grey" : "", borderRadius: "20px", }}>
              <span>3</span>
            </Col>{" "}
            <Col md={1} className="mr-2" style={{ backgroundColor: value === 4 ? "grey" : "", borderRadius: "20px", }}>
              <span>4</span>
            </Col>{" "}
            <Col md={1} className="mr-2" style={{ backgroundColor: value === 5 ? "grey" : "", borderRadius: "20px", }}>
              <span>5</span>
            </Col>{" "}
            <Col md={1} className="mr-1" style={{ backgroundColor: value === 6 ? "grey" : "", borderRadius: "20px", }}>
              <span>6</span>
            </Col>{" "}
            <Col md={1} className="mr-1" style={{ backgroundColor: value === 7 ? "grey" : "", borderRadius: "20px", }}>
              <span>7</span>
            </Col>{" "}
            <Col md={1} className="mr-1" style={{ backgroundColor: value === 8 ? "grey" : "", borderRadius: "20px", }}>
              <span>8</span>
            </Col>{" "}
            <Col md={1} className="mr-1" style={{ backgroundColor: value === 9 ? "grey" : "", borderRadius: "20px", }}>
              <span>9</span>
            </Col>
          </Row>
        </div>
      </div>

      <Slider
        progressStatus={objective.progressStatus}
        onChange={(value) =>
          handleChangeSearch({ target: { name: "progressStatus", value } })
        }
      />
    </div>
  );
};

export default SliderBar;
