import {useState, createContext, useContext, useEffect} from "react";
import * as api from "../api";
import useWebSocket from 'react-use-websocket';

const Context = createContext({})
const wsServerUrl= process.env.REACT_APP_WS_URL


export function AppProvider({children}) {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [socketUrl, setSocketUrl] = useState(wsServerUrl);
  const {sendMessage, lastMessage} = useWebSocket(socketUrl);

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
    };
  }, []);

  function setWsUrl(newRoom){
    setSocketUrl(wsServerUrl+"ws/"+newRoom);
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
    sendMessage,
    setWsUrl,
    lastMessage
  }

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  )
}

export const useAppCTX = () => useContext(Context)