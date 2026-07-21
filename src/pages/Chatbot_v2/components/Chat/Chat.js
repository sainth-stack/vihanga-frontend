import React from "react";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import './Chat.css'
//Open Ended Questions Chatbot
const Chat = ({ state, setState, visible, setVisible }) => {
  return (
    <div>
      {visible &&
        <div className="container1" style={{ borderRadius: '20px' }}>
          <InfoBar setVisible={setVisible} />
          <Messages  {...{ state, setState }} />
          <Input {...{ state, setState }} />
        </div>
      }
    </div>
  )
}
export default Chat;