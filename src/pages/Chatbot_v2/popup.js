import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react'
import Avatar from './components/avatar/avatar';
import Chat from './components/Chat/Chat';
function ChatBotV1() {
  const empName = JSON.parse(localStorage.getItem('user')).name
  const initialMessages = [
    {
      question: `Hi ${empName}, my name is TARA (TalentSpotify Artificial-Intelligence Response Assistant)`,
      type: 'bot'
    },
    {
      question: `Please choose a category that you would like to share your feedback on. We know that your feedback will help us in significantly improving your current experience and development at this organization.`,
      type: 'bot'
    },
    {
      showCategory: true
    }
  ]
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState({
    response: null,
    messages: initialMessages
  })
  const close = () => {
    setVisible(!visible)
  }
  return (
    <div className="" style={{ boxShadow: '10px' }}>
      <Chat visible={visible} {...{ state, setState, setVisible }} />
      <Avatar onClick={() => close()} {...{ visible }} />
    </div>
  );
}

export default ChatBotV1;
