// Config starter code
import React from 'react';
import { createChatBotMessage } from "react-chatbot-kit";
import SelectAnswer from './SelectAnswer';

const config = {
  initialMessages: [createChatBotMessage(`Hello, Please enter 1 to start`)],
  botName: 'ExampleBot',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#2A7A7B',
    },
    chatButton: {
      backgroundColor: '#2A7A7B',
    },
  },
  state: {
    myCustomProperty: 'singleFlight',
  },
  customComponents: {
  },
  widgets: [
    {
      widgetName: 'singleFlight',
      widgetFunc: (props) => <SelectAnswer {...props} />,
      props: {},
      mapStateToProps: ['selectedFlightId', 'selectedFlight'],
    },
  ],
}

export default config