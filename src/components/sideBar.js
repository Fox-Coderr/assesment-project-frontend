import React from "react";
import {useAppCTX} from "../context/app";
import * as api from "../api";

export function SideBar () {
  const {newNickname,setNewNickname, rooms, setRoom, setRooms} = useAppCTX()

  async function createRoom(roomName){
    try {
      await api.createRoom(roomName)
      setRooms(await api.getRooms())
      changeRoom(roomName)
    }catch(error) {
      console.error('Error fetching data:', error);
    }
  }

  const handlePrompt = async () => {
    const userInput = window.prompt('Enter something:');
    if (userInput !== null) {
      await createRoom(userInput)
    } else {
      alert('You canceled the input.');
    }
  }

  const changeRoom = (newRoom) => {
    if(newNickname === ''){
      alert('Please type a nickname')
    }else{
      setRoom(newRoom)
    }
  }

  return (
    <div className="column">
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
  )
}



