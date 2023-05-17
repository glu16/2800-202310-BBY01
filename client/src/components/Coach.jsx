import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

import styles from "../css/coach.module.css";

// The chat message code that displays the chat history
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
        <ul className={`${styles.message}`}>
          {lines.map((line, index) => {
            if (line.includes("Day")) {
              return (
                <React.Fragment key={index}>
                  <li>{line}</li>
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
// End of chat message code

const Coach = () => {
  // Visual effects
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
  // End of visual effects
  const username = localStorage.getItem("username");

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

  // This code gets the chat log from the database and displays it
  useEffect(
    () => {
      async function getChatLog() {
        const response = await fetch(
          `http://localhost:5050/coach/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data3 = await response.json();
        console.log(data3);
        const messages = data3
          .map((item) => {
            return item.messages.split().map((message) => ({
              user: item.user,
              message: message.trim(),
            }));
          })
          // The flat() method concatenates the subarray elements
          .flat();
        setChatLog(messages);
      }
      getChatLog();
    },
    // [username] stops the loop
    [username]
  );
  // End of code that gets the chat log from the database

  /* 
  Sends the chat lof to the database in the form
  [
    { user: "me", message: "Some message" },
    { user: "gpt", message: "Some message" },
    ...
  ]
  */
  async function sendChatLog(user, messages) {
    const username = localStorage.getItem("username");
    const response = await fetch(`http://localhost:5050/users/${username}`, {
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
  // End of code that sends the chat log to the database

  // useState hook variable for the modal
  const [showModal, setShowModal] = useState(false);

  // Modal open handler
  const openModal = () => {
    setShowModal(true);
  };

  // Modal close handler
  const closeModal = () => {
    setShowModal(false);
  };

  // Beginning of info modal component
  const InstructionsModal = () => {
    return (
      <div
        className={showModal ? `modal fade show` : `modal fade`}
        id="infoModal"
        tabIndex="-1"
        aria-labelledby="infoModalLabel"
        aria-hidden="false"
        style={{ display: showModal ? "block" : "none" }}
        role={showModal ? "dialog" : ""}
        aria-modal={showModal ? "true" : "false"}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className={`modal-title ${styles.formLabel}`}
                id="infoModalLabel"
              >
                Instructions
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className={`modal-body ${styles.modalBody}`}>
              <p>
                Welcome to your AI Coach!
                <br />
                <br />
                Our AI Coach is here to assist you with your diet and fitness
                goals. To get started, simply enter your prompt or question in
                the text input field. For example, you can ask for meal
                suggestions, request workout routines, seek nutrition advice, or
                inquire about specific exercises.
                <br />
                <br />
                Once you've entered your prompt, hit the 'Enter' key. Our AI
                Coach will process your input and provide a helpful response.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className={`btn btn-primary ${styles.modalBtn}`}
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // End of info modal component

  // The code comes largely from this video
  // https://www.youtube.com/watch?v=qwM23_kF4v4
  async function handleSubmit(event) {
    event.preventDefault();

    // Code that handles user and gpt interaction
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
  }
  // End of code that handles user and gpt interaction

  return (
    <div className={styles.coach}>
      <div className={styles.chatLogContainer}>
        <animated.h1 className={styles.coachTitle} style={greetings}>
          Welcome to your AI Coach!
          <a
            className={`${styles.icon} ${styles.infoLink} material-symbols-outlined`}
            onClick={openModal}
          >
            info
          </a>
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
      {/* Render the InfoModal */}
      {showModal && (
        <InstructionsModal closeModal={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Coach;
