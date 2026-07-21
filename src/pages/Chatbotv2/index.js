import React, { useEffect } from "react";
import Chatbot from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';

import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import logo from '../../assets/images/tara_logo.jpg';
// Replace with placeholder in development
const devLogo = require('../../assets/svg/dev-placeholder.svg');
const isDev = process.env.NODE_ENV === 'development';


//Close Ended Questions Chatbot
function ChatbotApp() {

  const openChatbot = () => {
    document.getElementById("chatbotApp").style.display = document.getElementById("chatbotApp").style.display === "block" ? "none" : "block";
    localStorage.removeItem("reviewData");
  }
  useEffect(() => {
    return () => {
      localStorage.removeItem("reviewData");
    }
  }, [])
  return (
    <div className="chatbotApp" id="chatbotApp">
      <div className="chatbotCloseContainer">
        <button className="chatbotClose" onClick={() => openChatbot()}>X</button>
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
          headerText={<div><img src={isDev ? devLogo : logo} alt="logo" className="appLogo2" />TARA</div>}
        />
      </div>
    </div>
  );
}

export default ChatbotApp;