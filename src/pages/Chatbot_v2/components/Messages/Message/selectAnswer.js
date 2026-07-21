import React, { useEffect, useState } from 'react'
import { getServiceUrl } from 'service/api';
import { chatbotApi } from 'service/apiVariables';
import { AuthUserId } from 'utilities';

export default function SelectAnswer(props) {
  const [options, setOptions] = useState([])
  const selectOption = (selectedOption) => {
    let { messages, index, state, setState } = props;
    let responsetime = "100";
    let numberOfQuestions = undefined
    let answer = '';
    let requestBody = {
      question: state.messages[index - 1].question, category: selectedOption, subcategory: "General", answer: messages[index - 1].message, responsetime, ranking: "WESY4", polarity: "Positive", linkIndex: 0, index: 0
    }
    console.log(requestBody)
    fetch(getServiceUrl("production") + chatbotApi.sendMessage(AuthUserId, numberOfQuestions, selectedOption).api, {
      method: "post",
      body: JSON.stringify(requestBody),
      headers: {
        "content-type": "application/json"
      }
    }).then(response => response.json())
      .then(data => {
        let message = "";
        if (numberOfQuestions === 0) {
          let message2 = props.actionProvider.createChatbotMessage(answer);
          props.setState((prev) => ({
            ...prev,
            response: null,
            messages: [...prev.messages, { ...message2, type: "user" }],
          }));
          props.setState((prev) => ({
            ...prev,
            response: null,
            messages: [...prev.messages, message],
          }));
        } else {
          setState((prev) => ({
            ...prev,
            response: data.data,
            messages: [...messages, { ...data.data, type: "bot" }],
          }));
          if (data.final) {
            setTimeout(() => {
              setState((prev) => ({
                ...prev,
                response: data.data,
                messages: [...messages, { ...data.data, type: "bot" }],
              }));
            }, [500])
          }
        }
      }).catch(error => {
        console.log(error);
      });
  }
  const getCompetencies = () => {
    fetch(getServiceUrl("production") + chatbotApi.getCompetencies.api, {
      method: "get",
      headers: {
        "content-type": "application/json"
      }
    }).then(response => response.json())
      .then(data => {
        setOptions(data.data)
      }
      ).catch(error => {
        console.log(error);
      }
      );
  }
  useEffect(() => {
    getCompetencies()
  }, []);

  return (
    <div>
      <div className='d-flex flex-wrap mt-1'>
        {options.length > 0 && options.map((option, index) => (
          <button className='btn btn-outline-primary rounded btn-sm p-2 m-1' style={{ height: '33px', fontSize: '10px', width: '175px' }} onClick={() => selectOption(option)} key={index}>{option}</button>
        ))}
      </div>
    </div>
  )
}
