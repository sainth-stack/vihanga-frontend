import React, { useState, useEffect } from "react";
import "./styles.scss";
import b1 from "assets/svg/b1.svg";
import b2 from "assets/svg/b2.svg";
import b3 from "assets/svg/b3.svg";
import PopupSendWish from "./Popup";
import { birthdayWish } from "action/UploadAct";
import { useDispatch } from "react-redux";
import { defaultProfilePic } from "utilities";
import { getEmployeByDateOfBirth1 } from "action/EmployeeAct";
const devPlaceholder = require("assets/svg/dev-placeholder.svg");
const isDev = process.env.NODE_ENV === 'development';

export default function Birthdayevent({
  data1,
  data2,
  data3,
  data4
}) { 
  const dispatch = useDispatch();
  const [data, setData] = useState([])
  const getEmployeeByDateOfBirth = () => {
    try {
      // setLoading2(true);
      let response = dispatch(getEmployeByDateOfBirth1());
      response.then(({ data, message }) => {
        const filterData = data.filter((item) => item.userType === 'Normal')
        setData(filterData)
      });
    } catch (error) {
      // setLoading2(false);
      // setError(error.toString());
    }
  };
  useEffect(() => {
    getEmployeeByDateOfBirth()
  }, [])
  let users = [
    { email: "mogiliv3@gmail.com", name: "Neelanjana Neela", description: "Happy Birthday Neelanjana Neela!", birthdaypic: b1, color: "#01ABF8", background: "#E1F5FF" },
    { email: "mogilivenkatesh3@gmail.com", name: "Muralidharan", description: "Happy Birthday Muralidharan!", birthdaypic: b2, color: "#F9B720", background: "#FFF4DE" },
    { email: "mogiliv3@gmail.com", name: "Niranjan", description: "Happy Birthday Niranjan!", birthdaypic: b3, color: "#B64DF6", background: "#F7EAFE" },
  ]
  return <>
    <div className="mt-1 pb-2">
      {data.map((user, index) => (
        <React.Fragment key={index}>
          <Card3 {...user} index={index} />
        </React.Fragment>
      ))}
    </div>
  </>;
}



function Card3(props, index) {
  const [openModel, setOpenModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(false);
  const dispatch = useDispatch();
  const sendWishes = (childData) => {
    try {
      setLoading(true);
      const data = {
        name: childData.name,
        description: childData.description,
        email: childData.email,
        type: "Birthday",
        senderName: (JSON.parse(localStorage.getItem("user")) || {}).name || ""
      };
      let response = dispatch(birthdayWish(data));
      response.then(({ data, message }) => {
        if (data !== undefined) {
          setOpenModel(false);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  return (
    <div className="events-list m-2 mt-2 mb-2" key={index + 1}>
      <div className="event-card" style={{}}>
        <div className="row event-row">
          <div className="event-body col-9">
            <div className="d-flex">
              <div className="ml-1 pl-4 pt-2">
                <img src={props.personalInformation.profilePicture ? props.personalInformation.profilePicture : defaultProfilePic} alt="birthdaypic" width={40} />
              </div>
              <div className="pl-2 pt-1 pb-1">
                <p className="p-0 m-0" style={{}}>{props.personalInformation.firstName + " " + props.personalInformation.lastName}</p>
                <p className="p-0 m-0 fs12" style={{ opacity: 0.6 }}>{"Happy Birthday" + " " + props.personalInformation.firstName}</p>
              </div>
            </div>
          </div>
          <div className="chat-icon col-2" onClick={() => setOpenModel(!openModel)}>
            <i className="fa fa-comment mr-4 pr-3 cursor-pointer" style={{}} alt="messageevent" />
          </div>
        </div>
      </div>
      {openModel && <PopupSendWish
        show={openModel}
        title="Birthday"
        name={props.personalInformation.firstName + " " + props.personalInformation.lastName}
        email={props.contactInformation.email}
        loading={loading}
        description={"Happy Birthday" + " " + props.personalInformation.firstName}
        onHide={() => setOpenModel(false)}
        handlecallback={(data) => sendWishes(data)} />}
    </div>
  );
}
