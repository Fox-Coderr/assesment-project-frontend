import React, {useEffect} from "react";
import {useAppCTX} from "../context/app";
import * as api from "../api";

export function ChatRoom () {
  const {messages,room, newMessage, setNewMessage, newNickname, setMessages, setWsUrl,sendMessage, lastMessage} = useAppCTX()

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    const messageData = {
      message_text: newMessage,
      timestamp: new Date().toISOString(),
      nickname: newNickname,
      room: room
    };
    sendMessage(JSON.stringify(messageData));
    setNewMessage('');
    setMessages(await api.getMessages(room))
  };

  useEffect(() => {
    async function loadMessages (){
      setMessages(await api.getMessages(room));
      setWsUrl(room);
    }
    if(room !== ''){
      loadMessages()
    }
  }, [room]);

    useEffect(() => {
      async function loadMessages (){
        setMessages(await api.getMessages(room));
        setWsUrl(room);
      }
      if(room !== ''){
        loadMessages()
      }
  }, [lastMessage]);

  return (
    <div className="column">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <p>{message.nickname}:</p>
            <p>{message.message_text}</p>
            <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      {room && (
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  )
}