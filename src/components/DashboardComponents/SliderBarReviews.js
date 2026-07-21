import React from "react";
import Slider from "components/Slider";
import { Row } from "react-bootstrap";
import { useState } from "react";
import image1 from "assets/svg/standing-up-man-1.svg";
import image2 from "assets/svg/standing-man2.svg";
import image3 from "assets/svg/standing-man3.svg";
import "./styles.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getChats } from "action/ChatbotAct";
import { AuthUserId } from "utilities";
const SliderBarReviews = () => {
  const [objective, setObjective] = useState({
    progressStatus: 0,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(0);
  const dispatch = useDispatch();
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
  const getChatsData = () => {
    try {
      setLoading(true);
      let response = dispatch(getChats());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let neutral = data.filter((item) => item.userId === AuthUserId && (item.polarity === "Neutral" || item.polarity === "More Neutral")).length;
          let positive = data.filter((item) => item.userId === AuthUserId && (item.polarity === "Positive" || item.polarity === "More Positive")).length;
          let negative = data.filter((item) => item.userId === AuthUserId && (item.polarity === "Negative" || item.polarity === "More Negative")).length;
          let totalStatus = Number(neutral + positive + negative);
          let progressStatus = totalStatus > 0 ? (Number(neutral * 5) + Number(positive * 10) + Number(negative * 1)) / totalStatus : 0;
          setData(progressStatus)
          setLoading(false)
        } else if (data.length === 0) {
          setLoading(false);
          // setError("No Data Found!");
        } else {
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    getChatsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <div
        title={data > 0 ? "Your Review Score is " + data.toFixed(2) : "No Data Found!"}>
        <Row className="mt-5 pt-5 d-flex justify-content-between align-items-center">
          <div md={1} xs={1} className="mr-1 text-center">
            <img src={image1} height={90} width={70} alt="slider" />
            <br />
            <span>1</span>
          </div>
          <div xs={1} className="mr-1 text-center">
            <img src={image1} height={90} width={70} alt="slider" />
            <br />
            <span>2</span>
          </div>
          <div xs={1} className="mr-1 text-center">
            <img src={image1} height={90} width={70} alt="slider" />
            <br />
            <span>3</span>
          </div>
          <div xs={1} className="mr-1 text-center">
            <img src={image1} height={90} width={70} alt="slider" />
            <br />
            <span>4</span>
          </div>
          <div xs={1} className="mr-1 text-center">
            <img src={image2} height={90} width={70} alt="slider" />
            <br />
            <span>5</span>
          </div>
          <div xs={1} className="mr-1 text-center">
            <img src={image2} height={90} width={70} alt="slider" />
            <br />
            <span>6</span>
          </div>
          <div xs={1} className="mr-1 text-center">
            <img src={image2} height={90} width={70} alt="slider" />
            <br />
            <span>7</span>
          </div>
          <div xs={1} className="mr-1 text-center">
            <img src={image3} height={90} width={70} alt="slider" />
            <br />
            <span>8</span>
          </div>
          <div xs={1} className="mr-1 text-center">
            <img src={image3} height={90} width={70} alt="slider" />
            <br />
            <span>9</span>
          </div>
          <div xs={1} className="mr-1 text-center">
            <img src={image3} height={90} width={70} alt="slider" />
            <br />
            <span>10</span>
          </div>
        </Row>
        {/* <span className={`text-${variantColor()}`}>
          {value}
        </span> */}
        {/*<div>
          <Row className="mt-4 rowstyles2 d-flex justify-content-center align-items-center">
            <Col xs={1} className="mr-1 text-center" style={{ backgroundColor: value === 0 ? "grey" : "", color: value === 0 ? "white" : "black", borderRadius: "20px", }}>
              <span>1</span>
            </Col>{" "}
            <Col xs={1} className="mr-1  text-center" style={{ backgroundColor: value === 1 ? "grey" : "", color: value === 1 ? "white" : "black", borderRadius: "20px", }}>
              <span>2</span>
            </Col>{" "}
            <Col xs={1} className="mr-1  text-center" style={{ backgroundColor: value === 2 ? "grey" : "", color: value === 2 ? "white" : "black", borderRadius: "20px", }}>
              <span>3</span>
            </Col>{" "}
            <Col xs={1} className="mr-1  text-center" style={{ backgroundColor: value === 3 ? "grey" : "", color: value === 3 ? "white" : "black", borderRadius: "20px", }}>
              <span>4</span>
            </Col>{" "}
            <Col xs={1} className="mr-2  text-center" style={{ backgroundColor: value === 4 ? "grey" : "", color: value === 4 ? "white" : "black", borderRadius: "20px", }}>
              <span>5</span>
            </Col>{" "}
            <Col xs={1} className="mr-2  text-center" style={{ backgroundColor: value === 5 ? "grey" : "", color: value === 5 ? "white" : "black", borderRadius: "20px", }}>
              <span>6</span>
            </Col>{" "}
            <Col xs={1} className="mr-1  text-center" style={{ backgroundColor: value === 6 ? "grey" : "", color: value === 6 ? "white" : "black", borderRadius: "20px", }}>
              <span>7</span>
            </Col>{" "}
            <Col xs={1} className="mr-1  text-center" style={{ backgroundColor: value === 7 ? "grey" : "", color: value === 7 ? "white" : "black", borderRadius: "20px", }}>
              <span>8</span>
            </Col>{" "}
            <Col xs={1} className="mr-1  text-center" style={{ backgroundColor: value === 8 ? "grey" : "", color: value === 8 ? "white" : "black", borderRadius: "20px", }}>
              <span>9</span>
            </Col>{" "}
            <Col xs={1} className="mr-1  text-center" style={{ backgroundColor: value === 9 ? "grey" : "", color: value === 9 ? "white" : "black", borderRadius: "20px", }}>
              <span>10</span>
            </Col>
          </Row>
        </div>*/}
      </div>

      {data > 0 && <Slider
        progressStatus={data * 10}
        onChange={(value) =>
          handleChangeSearch({ target: { name: "progressStatus", value } })
        }
        bronze={400}
        silver={700}
        gold={1000}
        disabled
      />}
    </div>
  );
};

export default SliderBarReviews;
