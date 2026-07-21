import React, { useEffect, useState } from "react";
import wrong from "assets/svg/wrong.svg";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { questionData, HRAdminData, ManagerData } from "utilities";
const OnBoarding = (props) => {
  const history = useHistory()
  const [, setHover] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))
  const [questioinSelect, setQuestionSelect] = useState([])
  const handleClick = (childData, action) => {
    localStorage.setItem("showObjTour", true);
    props.onHide()
    history.push
      ({
        pathname: '/admin/' + `${childData}`,
        state: { isVisible: true, story: action }
      })

  }
  const getData = () => {
    if (user.role === 'Employee') {
      setQuestionSelect(questionData)
    } else if (user.role === "Manager") {
      setQuestionSelect([...questionData, ...ManagerData])
    }
    else {
      setQuestionSelect([...questionData, ...HRAdminData])
    }
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        style={{
          background: "#F5F5F6",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.17)",
        }}
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ paddingTop: "10px", paddingLeft: "20px" }}
        >
          TalentSpotify ShowTour
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="">
            <div className="_3-4yw">
              <div className="m-2"><h6><b>Hi there</b> <span role="img" aria-label="hello">👋</span></h6>
                <h6><b>Welcome to TalentSpotify Onboarding.</b></h6></div>
              <div className="mt-3 ml-2">
                {
                  questioinSelect.map((item, index) => {
                    return (
                      <li style={{ cursor: 'pointer' }} key={index} onClick={(e) => handleClick(item.value, item.action)} onMouseEnter={() => {
                        setHover(true);
                      }}
                        onMouseLeave={() => {
                          setHover(false);
                        }}>{item.key}</li>
                    )
                  })
                }
              </div>
              {/* <div className="pt-3 pb-3 mb-3">
                                <SelectInput
                                    label="Questions"
                                    placeholder="--Select--"
                                    name="employeeReferenceId"
                                    options={questionData}
                                    value={question}
                                    onChangeText={(e) => handleChangeSearch(e)}
                                />
                            </div> */}
              {/* <div className="_2t0S1">
                                <button className="_1szgW m-2" style={{ borderRadius: '100px' }} onClick={(e) => showSubmit(e)}>Yes, show me</button>
                                <button className="_3t0Wm m-2" style={{ borderRadius: '100px' }} onClick={() => props.onHide()}>Not right now</button>
                            </div> */}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OnBoarding;
