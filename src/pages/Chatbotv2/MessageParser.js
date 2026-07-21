class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  nextQuestion() {
    this.actionProvider.nextQuestion();
  }

  parse(message) {
    if (['1'].includes(message)) {
      this.actionProvider.handleHello();
    } else if (message.includes('how are you?')) {
      this.actionProvider.handleHowAreYou();
    }
  }
}

export default MessageParser;