import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style.css';

function  ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const ws = useRef(null);

  const serverUrl= process.env.REACT_APP_BASE_URL
  const wsServerUrl= process.env.REACT_APP_WS_URL

  function getRooms(){
      axios.get(serverUrl+'rooms/')
      .then((response) => {
          setRooms(response.data.chat_rooms);

      }).then(()=>{

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

  }

  function getMessages(room){
      axios.get(serverUrl+'messages/get_messages/'+room+'/')
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  function createRoom(roomName){
      axios.post(serverUrl+'rooms/create_room/', {
          name:roomName
      })
      .then((response) => {
        getRooms()
        changeRoom(roomName)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  function prepareWs(newRoom){
    // Replace 'your_websocket_url' with your WebSocket server URL.
    ws.current = new WebSocket(wsServerUrl+"ws/"+newRoom);

    ws.current.onopen = () => {
      // console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    ws.current.onclose = () => {
      // console.log('WebSocket connection closed');
    };
  }

  useEffect(() => {
    getRooms()
    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
      if(room !== ''){
          getMessages(room);
          prepareWs(room);
      }
  }, [room]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const messageData = { message_text: newMessage, timestamp: new Date().toISOString(), nickname:newNickname, room:room};
    ws.current.send(JSON.stringify(messageData));
    setNewMessage('');
    getMessages(room)
  };

  const handlePrompt = () => {
    const userInput = window.prompt('Enter something:');
    if (userInput !== null) {
        createRoom(userInput)
    } else {
      alert('You canceled the input.');
    }
  };

  const changeRoom = (newRoom) => {
      if(newNickname === ''){
          alert('Please type a nickname')
      }else{
          setRoom(newRoom)
          if (ws.current) {
            ws.current.close();
          }
      }
    }

  setInterval(() => {
      getRooms();
    }, 30000);

  return (
    <div className="container">
      <div className="column">>
          <label htmlFor="room">Nickname:</label>
          <div className="input-container">
            <input
              type="text"
              placeholder="Type your nickname..."
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
            />
          </div>
          <br />
          <button onClick={handlePrompt}>Create new room</button>
          <p />
          <label htmlFor="room">Select a room:</label>
          <p />
          {rooms.map((room, index) => (
              <div key={room.id}>
                  <a href={'#'} onClick={(e) => changeRoom(room.id)}>{room.room_name}</a>
                  <p />
              </div>
          ))}
      </div>
      <div className="line"></div>
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
          {room !== '' &&
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
          }
      </div>
    </div>
  );
};

export default ChatRoom;