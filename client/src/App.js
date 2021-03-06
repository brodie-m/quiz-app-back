import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Form from "./components/Form";
import Chat from "./components/Chat";
import immer from "immer";

import { getQuestions } from "./actions";
import { useDispatch, useSelector } from "react-redux";
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

  const dispatch = useDispatch();
  const results = useSelector((state) => state.questions)
  const search = (searchTerm) => dispatch(getQuestions(searchTerm))

  useEffect(() => {
    let isMounted = true;
    const searchArr = [{
      amount: 10,
      category: 9,
      difficulty: `medium`,
      type: `multiple`
    },
    {
      amount: 10,
      category: 10,
      difficulty: `medium`,
      type: `multiple`
    },
    {
      amount: 10,
      category: 11,
      difficulty: `medium`,
      type: `multiple`
    },
    {
      amount: 10,
      category: 12,
      difficulty: `medium`,
      type: `multiple`
    },];
    
    const search = (searchTerm) => dispatch(getQuestions(searchTerm))
    if(isMounted) {
    search(
      searchArr[Math.floor(Math.random() * searchArr.length -1)]
      )
    }
      return () => {isMounted = false};
  }, [connectedRooms, dispatch])

  useEffect(() => {
    setMessage("");
  }, [messages]);

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function handleChange(e) {
    setUsername(e.target.value);
  }

  function roomJoinCallback(incomingMessages, room) {
    const newMessages = immer(messages, (draft) => {
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
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName] = [];
      });
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

  

  function connect() {
    setConnected(true);
    const socket = io("http://localhost:3001", {
      withCredentials: true,
    });
    socket.connect();

    socketRef.current = socket;
    console.log(socketRef.current);
    socketRef.current.emit("join-server", username);
    socketRef.current.emit("join-room", "general", (messages) => {
      roomJoinCallback(messages, "general");
    });
    socketRef.current.on("new-user", (allUsers) => {
      setAllUsers(allUsers);
      console.log(allUsers);
    });
    socketRef.current.on("new-message", ({ content, sender, chatName }) => {
      setMessages((messages) => {
        const newMessages = immer(messages, (draft) => {
          if (draft[chatName]) {
            draft[chatName].push({ content, sender });
          } else {
            draft[chatName] = [{ content, sender }];
          }
        });
        return newMessages;
      });
    });
  }
  

  

  let body;

  if (connected) {
    body = (
      <div>
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
          getQuestions = {search}
          results={results}
        />
        
          
      </div>
    );
  } else {
    body = (
      <Form
        username={username}
        onChange={handleChange}
        connect={connect}
        onSubmit={connect}
      />
    );
  }

  return <div className="App">{body}</div>;
}

export default App;
