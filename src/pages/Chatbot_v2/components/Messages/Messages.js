import React, { useCallback, useEffect, useRef, useState } from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ name, scroll, message, state, setState }) => {
  const count = useRef(0)
  const observer = useRef()
  const end = useRef()
  const messagesStrRef = useRef()
  const [called, setCalled] = useState()
  useEffect(() => {
    end.current.scrollIntoView({ behavior: "auto", block: "end", inline: 'end' })
  }, [message])
  const lastElement = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (called !== node && count.current >= 1) {
          setCalled(node)
        }
      }
    })
    if (node) observer.current.observe(node)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (scroll > 0) {
    messagesStrRef.current.scrollIntoView({ behavior: "auto", block: "start", inline: 'start' })
  }
  return (
    <ScrollToBottom className="messages" >
      {state.messages.map((message, i) => {
        if (i === 5) {
          count.current = count.current + 1;
          return <div key={i} ref={lastElement}>
            <Message message={message} name={name} messages={[...state.messages]} index={i} {...{ state, setState }} />
          </div>
        }
        else return <div key={i}>
          <Message message={message} name={name} messages={[...state.messages]} index={i} {...{ state, setState }} />
        </div>
      }

      )}
      <div ref={end} />
    </ScrollToBottom>)
}

export default Messages;