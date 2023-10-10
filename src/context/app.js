import {useRef, useState, createContext, useContext, useEffect} from "react";
import * as api from "../api";

const Context = createContext({})
const wsServerUrl= process.env.REACT_APP_WS_URL

export function AppProvider({children}) {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    async function loadRooms () {
      setRooms(await api.getRooms());
    }
    const id = setInterval(() => {
    loadRooms()
    }, 30000);
    loadRooms()
    return () => {
      clearInterval(id)
      ws.current.close();
    };
  }, []);

  function createWs(newRoom){
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

    return ws.current
  }

  const context ={
    messages,
    setMessages,
    rooms,
    setRooms,
    room,
    setRoom,
    newMessage,
    setNewMessage,
    newNickname,
    setNewNickname,
    createWs,
    get ws() {
      return ws.current
    }
  }

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  )
}

export const useAppCTX = () => useContext(Context)