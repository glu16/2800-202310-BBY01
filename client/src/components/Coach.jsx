import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import "../css/coach.css";

const ChatMessage = ({ message }) => (
  <div className="chatMessageContainer">
    <div className={`avatar ${message.user === "gpt" && "AI"}`}></div>
    <div className="message">{message.message}</div>
  </div>
);

const Coach = () => {
  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([

    
  ]);

  useEffect(() => {
    const userEmail = localStorage.getItem("email");

    async function fetchChatLog() {

      const response3 = await fetch(`http://localhost:8000/coach/${userEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });

      const data3 = await response3.json();
      
      console.log(data3 + "this is the data");
      setChatLog([{user: 'user',message: data3}]);

    }
    fetchChatLog();
  }, []);


  async function handleSubmit(event) {
    event.preventDefault();

    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);

    const messages = chatLogNew.map((message) => message.message).join("\n");

    const response = await fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
      }),
    });

    const data = await response.json();
    console.log(input);
    console.log(data);

    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);

    //NEW CODE FOR PUT REQUEST
    const key = "messages";
    const value = messages + "\n" + data.message;
    const data2 = { [key]: value };

    const userEmail = localStorage.getItem("email");
    const response2 = await fetch(`http://localhost:8000/users/${userEmail}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data2),
    });

    const updatedUser = await response2.json();
    console.log(updatedUser);
    //END OF NEW CODE FOR PUT REQUEST
  }

  return (
    <div className="coach">
      <div className="chatLogContainer">
        <animated.h1 className="display-4" style={greetings}>
          Welcome to your AI Coach!
        </animated.h1>
        {chatLog.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      <div className="textInputContainer">
        <form onSubmit={handleSubmit}>
          <input
            className="textInput"
            placeholder="Enter your prompt here"
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></input>
        </form>
      </div>
    </div>
  );
};

export default Coach;
