import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

import styles from "../css/coach.module.css";

const ChatMessage = ({ message }) => {
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
        className={`avatar ${message.user === "gpt" && "AI"} ${styles.userAvatar}`}
      ></div>
      <div className={styles.message}>{message.message}</div>
    </div>
  );
};

const Coach = () => {
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

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

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
