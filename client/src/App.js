import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Form from "./components/Form";
import Chat from "./components/Chat";
import immer from "immer";
import "./App.css";


const initialMessagesState = {
  general: [],
  jokes: [],
  random: [],
  javascript: [],
};

function App() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "general",
    receiverId: "chat",
  });
  const [connectedRooms, setConnectedRooms] = useState(["general"]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    setMessage('')
  }, [messages])

  useEffect(() => {
    fetchData()
  },[])

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function handleChange(e) {
    setUsername(e.target.value)
  }

  function roomJoinCallback(incomingMessages, room) {
    const newMessages = immer(messages, draft => {
      draft[room] = incomingMessages;

    });
    setMessages(newMessages);
  }

  function joinRoom(room) {
    const newConnectedRooms = immer(connectedRooms, (draft) => {
      draft.push(room);
    });
    socketRef.current.emit("join-room", room, (messages) => {
      roomJoinCallback(messages, room);
    });
    setConnectedRooms(newConnectedRooms);
  }

  function toggleChat(currentChat) {
    if (!messages[currentChat.chatName]) {
      const newMessages = immer(messages, draft => {
        draft[currentChat.chatName] = [];
      })
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }


  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };
    socketRef.current.emit("send-message", payload);
    const newMessages = immer(messages, (draft) => {
      draft[currentChat.chatName].push({
        sender: username,
        content: message,
      });
    });
    setMessages(newMessages);
  }

  async function fetchData() {
    const result = await fetch('https://opentdb.com/api.php?amount=10&category=24&difficulty=medium&type=multiple')
    const data = await result.json()
    console.log(data.results)
    return data
  }

  function connect() {
    setConnected(true);
    const socket = io("http://localhost:3001", {
      withCredentials: true,
    });
    socket.connect()
  
    socketRef.current = socket
    console.log(socketRef.current)
    socketRef.current.emit('join-server', username);
    socketRef.current.emit('join-room', 'general', (messages) => {
      roomJoinCallback(messages, 'general')
    });
    socketRef.current.on('new-user', allUsers => {
      setAllUsers(allUsers)
      console.log(allUsers)
    })
    socketRef.current.on('new-message', ({content,sender,chatName}) => {
      setMessages(messages => {
        const newMessages = immer(messages, draft => {
          if (draft[chatName]) {
            draft[chatName].push({content, sender})
          } else {
            draft[chatName] = [{content, sender}]
          }

        });
        return newMessages;
      })
    })
  }

  let body;
  if (connected) {
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourId={socketRef.current ? socketRef.current.id : ""}
        allUsers={allUsers}
        joinRoom={joinRoom}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    );
  } else {
    body = (
      <Form username={username} onChange = {handleChange} connect = {connect} onSubmit={connect}/>
    )
  }

  return <div className="App">{body}</div>;
}

export default App;
