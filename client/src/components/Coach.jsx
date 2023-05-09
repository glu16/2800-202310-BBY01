import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

import styles from "../css/coach.module.css";

//THE CHAT MESSAGE CODE THAT DISPLAYS THE CHAT HISTORY
const ChatMessage = ({ message }) => {
  if (!message || typeof message.message !== "string") {
    return null;
  }
  const lines = message.message.split("\n");

  if (lines.length > 1) {
    return (
      <div className={styles.chatMessageContainer}>
        <div
          className={`avatar ${message.user === "gpt" && "AI"} ${
            styles.gptAvatar
          }`}
        ></div>
        <ul className={styles.message} style={{}}>
          {lines.map((line, index) => {
            if (line.includes("Day")) {
              return (
                <React.Fragment key={index}>
                  <br />
                  <li>{line}</li>
                  <br />
                </React.Fragment>
              );
            } else {
              return <li key={index}>{line}</li>;
            }
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.chatMessageContainer}>
      <div
        className={`avatar ${message.user === "gpt" && "AI"} ${
          styles.userAvatar
        }`}
      ></div>
      <div className={styles.message}>{message.message}</div>
    </div>
  );
};
//END OF CHAT MESSAGE CODE

const Coach = () => {
  //VISUAL EFFECTS
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });
  //END OF VISUAL EFFECTS
  const email = localStorage.getItem("email");

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([

  ]);

  useEffect(() => {
    async function getChatLog() {
      const response = await fetch(`http://localhost:5050/coach/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data3 = await response.json();
      console.log(data3);
      console.log(JSON.stringify(data3));
      return JSON.parse(JSON.stringify(data3));
    }
    getChatLog();
  }, []);

  /* 
  SENDS THE CHAT LOG TO THE DATABASEIN THE FORM
  [
    { user: "me", message: "Some message" },
    { user: "gpt", message: "Some message" },
    ...
  ]
  */
  async function sendChatLog(user, messages) {
    const email = localStorage.getItem("email");
    const response = await fetch(`http://localhost:5050/users/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        messages,
      }),
    });
  }
  // END OF CODE THAT SENDS THE CHAT LOG TO THE DATABASE

  async function handleSubmit(event) {
    event.preventDefault();

    //CODE THAT HANDLES USER AND AI INTERACTION
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);
    await sendChatLog("me", input);

    const messages = chatLogNew.map((message) => message.message).join("\n");

    const response = await fetch("http://localhost:5050/", {
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
    await sendChatLog("gpt", data.message);

    //END OF CODE THAT HANDLES USER AND AI INTERACTION
  }

  return (
    <div className={styles.coach}>
      <div className={styles.chatLogContainer}>
        <animated.h1 className={styles.coachTitle} style={greetings}>
          Welcome to your AI Coach!
        </animated.h1>
        {chatLog.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      <div className={styles.textInputContainer}>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.textInput}
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
