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

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState(() => {
    //THE CHAT HISTORY IS FROM LOCAL STORAGE AND NOT DATABASE WHICH MAY NEED TO BE CHANGED
    //NOTE THAT APP.GET("/COACH/:EMAIL") IS NO LONGER USED
    const storedChatLog = localStorage.getItem("chatLog");
    return storedChatLog ? JSON.parse(storedChatLog) : [];
  });

  //OLD CODE THAT USED APP.GET("/COACH/:EMAIL") USED TO BE HERE
  //THE OLD CODE RETRIEVED THE CHAT HISTORY FROM THE DATABASE
  useEffect(() => {
    localStorage.setItem("chatLog", JSON.stringify(chatLog));
  }, [chatLog]);
  //END OF OLD CODE

  async function handleSubmit(event) {
    event.preventDefault();

    //CODE THAT HANDLES USER AND AI INTERACTION
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
    //END OF CODE THAT HANDLES USER AND AI INTERACTION

    //PUT REQUEST THAT SEND THE UPDATED CHATLOG TO THE DATABASE
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
    //END OF PUT REQUEST
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
