import React from 'react';
import './App.css';
import './style.css';
import {AppProvider} from "./context/app";
import {SideBar} from "./components/sideBar";
import {ChatRoom} from "./components/chatRoom";


function App() {
  return (
    <AppProvider>
      <div className="container">
        <SideBar />
      <div className="line"></div>
        <ChatRoom />
      </div>
    </AppProvider>
  );
}

export default App;