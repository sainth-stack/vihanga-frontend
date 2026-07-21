import React, { useState } from 'react';

import './Input.css';
import { getServiceUrl } from 'service/api';
import { chatbotApi } from 'service/apiVariables';
import { Toast } from 'service/toast';
import { AuthUserId } from 'utilities'; const Input = ({ state, setState }) => {
  const [msg, setMsg] = useState('')
  const sendMessage = (e) => {
    e.preventDefault()
    setMsg('')
    handleAnswer(msg, state.response)
  }
  const handleAnswer = (answer = "", response) => {
    //api call and question
    let { question, numberOfQuestions, category, linkIndex, index } = response;
    let responsetime = "100";
    let ans = [];
    let finData = {
      ...state,
      messages: [
        ...state.messages, {
          question: question,
          answer: answer,
          type: "user"
        }
      ]
    }
    finData.messages.map((item) => {
      if (item.question === question && item?.answer) {
        ans.push(...item.answer.split(' '))
      }
    })
    let answer1 = ans.join(" ")
    setState(finData)
    setTimeout(() => {
      if (ans.length > 4) {
        if (numberOfQuestions > 0) {
          fetch("https://4a53-13-213-112-212.ngrok-free.app/api/model", {
            method: "post",
            body: JSON.stringify({
              inputs: [
                {
                  Employer: "Self",
                  Question: question,
                  Response: answer,
                }
              ]
            }),
            headers: {
              "content-type": "application/json"
            }
          }).then(response => response.json())
            .then(dataResponse => {
              fetch(getServiceUrl("production") + chatbotApi.sendMessage(AuthUserId, numberOfQuestions, answer = answer1).api, {
                method: "post",
                body: JSON.stringify({
                  question, numberOfQuestions, category, answer: answer1, responsetime, polarity: "Positive", linkIndex, index
                }),
                headers: {
                  "content-type": "application/json"
                }
              }).then(response => response.json())
                .then(data => {
                  setState((prev) => ({
                    ...prev,
                    response: data.data,
                    messages: [...state.messages, {
                      question: msg,
                      type: "user"
                    }, { ...data.data, type: "bot" }],
                  }));
                }).catch(error => {
                  console.log("Error", error);
                  Toast({ type: "error", message: "Something went wrong", time: 5000 });
                })
            }).catch(error => {
              console.log("Error", error);
              Toast({ type: "error", message: "Something went wrong", time: 5000 });
            })
        }
      } else {
        setTimeout(() => {
          let finData1 = {
            ...finData,
            messages: [
              ...finData.messages, {
                question: `Hey ${JSON.parse(localStorage.getItem('user')).name}, I want to know more about what you are saying. Could you elaborate on that please?`,
                type: "bot"
              }
            ]
          }
          setState(finData1)
        }, [1000])
      }
    }, [500])
  }

  return (
    <form className="form">
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={msg}
        onChange={({ target: { value } }) => setMsg(value)}
        onKeyDown={event => event.key === 'Enter' ? sendMessage(event) : null}
      />
      <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
    </form>)
}


export default Input;