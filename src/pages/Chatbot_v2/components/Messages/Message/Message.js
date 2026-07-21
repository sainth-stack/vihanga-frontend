import React from 'react';
import './Message.css';
import SelectAnswer from './selectAnswer';
const Message = ({ message: { question, type, showCategory, answer }, messages, index, state, setState }) => {
  let username = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')).name : "";
  let questionF = answer ? answer : question ? question : `Thank you for your time and your valuable feedback ${username}. Hope you have a good day ahead!`
  const myArray = questionF?.split("\n");
  const msg1 = myArray?.map((item) => {
    return <p className='messageText'>{item} <br /></p>
  })
  let isSentByCurrentUser = false;
  if (type === 'user') {
    isSentByCurrentUser = true;
  }
  if (showCategory) {
    return (
      <SelectAnswer {...{ messages, index, state, setState }} />
    )
  } else {
    return (
      isSentByCurrentUser
        ? (
          <div className="messageContainer justifyEnd mt-2 mb-2">
            <div className="messageBox backgroundBlue p-0 d-flex flex-column" style={{ backgroundColor: 'grey', marginRight: 'px' }}>
              {msg1}
            </div>
            <img src={JSON.parse(localStorage.getItem('user')).profilePicture} style={{ width: '40px', borderRadius: '50%' }} />
          </div>
        )
        : (
          <div className="messageContainer justifyStart mt-1">
            <div style={{ width: '40px', height: '40px', backgroundColor: 'grey', marginTop: '10px', borderRadius: '50%' }}><span style={{ position: 'relative', top: '8px', left: '15px', color: 'white' }}>B</span></div>
            <div className="messageBox p-0 d-flex flex-column ml-1" style={{ backgroundColor: '#2A7A7B' }}>
              {msg1}
            </div>
          </div>
        )
    );
  }
}

export default Message;