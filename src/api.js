import axios from 'axios';

const serverUrl= process.env.REACT_APP_BASE_URL

export async function getRooms(){
  try{
    const response = await axios.get(serverUrl+'rooms/')
    return response.data.chat_rooms
  }catch(error) {
    console.error('Error fetching data:', error);
    return []
  }
}

export async function getMessages(room){
  try {
    const response = await axios.get(serverUrl + 'messages/' + room + '/')
    return response.data;
  }catch(error) {
    console.error('Error fetching data:', error);
    return []
  }
}

export async function createRoom(roomName){
  try {
    const response = await axios.post(serverUrl + 'rooms/', {
              name: roomName
          })
    return response.data;
  }catch(error) {
    console.error('Error fetching data:', error);
    return []
  }
}