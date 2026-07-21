import React, { useEffect, useState } from "react";
import wrong from "assets/svg/wrong.svg";
import { Modal } from "react-bootstrap";
import SelectInput from "components/Company/SelectInput";
import { questionData } from "utilities";
const OnBoarding = (props) => {
    const [question, setQuestion] = useState('')
    const showSubmit = () => {
        props.onHide()
        props.handlecallback(question)
    }
    const handleChangeSearch = (e) => {
        setQuestion(e.target.value)
    }
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
                    Talent Spotify OnBoarding
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
                            <div><p><b>Hi there</b> <span role="img" aria-label="hello">👋</span></p>
                                <p>Welcome to Talent Spotify Onboarding.</p></div>
                            <div className="pt-3 pb-3 mb-3">
                                <SelectInput
                                    label="Questions"
                                    placeholder="--Select--"
                                    name="employeeReferenceId"
                                    options={questionData}
                                    value={question}
                                    onChangeText={(e) => handleChangeSearch(e)}
                                />
                            </div>
                            <div className="_2t0S1">
                                <button className="_1szgW m-2" style={{borderRadius:'100px'}} onClick={(e) => showSubmit(e)}>Yes, show me</button>
                                <button className="_3t0Wm m-2" style={{borderRadius:'100px'}} onClick={()=>props.onHide()}>Not right now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default OnBoarding;
