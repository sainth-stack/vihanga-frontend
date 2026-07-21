import React, { useState } from "react";
import "./styles.scss"
import PopupSendWish from "./Popup";
import { birthdayWish } from "action/UploadAct";
import { useDispatch } from "react-redux";
import { defaultProfilePic, getRandomColor, getRandomColor2 } from "utilities";
import { getEmployeByHireDate1 } from "action/EmployeeAct";
import { useEffect } from "react";
export default function Anniversaryevent() {
  const dispatch = useDispatch();
  const [data, setData] = useState([])
  const getEmployeeByHire = () => {
    try {
      // setLoading2(true);
      let response = dispatch(getEmployeByHireDate1());
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
    getEmployeeByHire()
  }, [])
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
        type: "Anniversary",
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
  let bg = getRandomColor();
  let color = getRandomColor2();
  return (
    <div className="events-list m-2 mt-2 mb-2" key={index}>
      <div className="event-card " style={{ backgroundColor: bg ? bg : "#2A7A7B" }}>
        <div className="row event-row">
          <div className="event-body col-9 ">
            <div className="d-flex">
              <div className="ml-1 pl-4 pt-2">
                <img src={props.personalInformation.profilePicture ? props.personalInformation.profilePicture : defaultProfilePic} alt="birthdaypic" className="circle" width={40} />
              </div>
              <div className="pl-2 pt-1 pb-1">
                <p className="p-0 m-0" style={{ color: color ? color : "#FFFFFF" }}>{props.personalInformation.firstName + " " + props.personalInformation.lastName}</p>
                <p className="p-0 m-0 fs12" style={{ opacity: 0.9, color: color ? color : "#FFFFFF" }}>{"Happy Work Anniversary" + ' ' + props.personalInformation.firstName}</p>
              </div>
            </div>
          </div>
          <div className="chat-icon col-2" onClick={() => setOpenModel(!openModel)}>
            <i className="fa fa-comment mr-4 pr-3 cursor-pointer" style={{ color: color ? color : "#FFFFFF" }} alt="messageevent" />
          </div>
        </div>
      </div>
      {openModel && <PopupSendWish
        show={openModel}
        title="Anniversary"
        name={props.personalInformation.firstName + " " + props.personalInformation.lastName}
        email={props.contactInformation.email}
        loading={loading}
        description={"Happy Work Anniversary" + " " + props.personalInformation.firstName}
        onHide={() => setOpenModel(false)}
        handlecallback={(data) => sendWishes(data)} />}
    </div>
  );
}
