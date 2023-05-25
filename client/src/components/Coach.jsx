// Import statements
import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import axios from "axios";

// CSS module import statement
import styles from "../css/coach.module.css";
// Image import statement
import pfpPlaceholder from "../img/placeholder-profile.png";

// Function that displays the chat history
const ChatMessage = ({ message }) => {
  const [userAvatar, setUserAvatar] = useState("");

  const username = localStorage.getItem("username");

  useEffect(() => {
    async function getUserAvatar() {
      const response = await axios.get(
        `http://localhost:5050/coachPic/${username}`
      );
      setUserAvatar(response.data);
    }

    getUserAvatar();
  });

  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 330,
  });
  // End of visual effects
  if (!message || typeof message.message !== "string") {
    return null;
  }
  const lines = message.message.split("\n");

  if (message.user === "gpt") {
    return (
      <animated.div className={styles.chatMessageContainer} style={greetings}>
        <div
          className={`avatar ${message.user === "gpt" && "AI"} ${
            styles.gptAvatar
          }`}
        ></div>
        <ul className={`${styles.message} ${styles.coachMessage}`}>
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
      </animated.div>
    );
  }

  return (
    <animated.div
      className={`${styles.chatMessageContainer} ${styles.userContainer}`}
      style={greetings}
    >
      <div
        className={`${styles.userAvatar} ${styles.userAvatarImage}`}
        style={{
          backgroundImage: userAvatar
            ? `url(${userAvatar})`
            : `url(${pfpPlaceholder})`,
          // If there is no avatar, use a white background
          // backgroundColor: userAvatar ? "" : "white",
        }}
      ></div>
      <div className={`${styles.message} ${styles.userMessage}`}>
        {message.message}
      </div>
    </animated.div>
  );
};
// End of chat history function

const Coach = () => {
  // Visual text animation effects
  const greetings = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });
  // End of visual text animation effects

  // Username variable for retrieving the logged in user's username
  const username = localStorage.getItem("username");

  // useState hook variables for the user's prompts
  const [input, setInput] = useState("");

  // useState hook variables for the chat history
  const [chatLog, setChatLog] = useState([]);

  // useState hook variable to assign the value to the useRef hook
  const chatLogRef = useRef(null);

  // useEffect hook that retrieves the chat log from the database and displays it
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
  // End of useEffect hook that retrieves the chat log

  /* 
  Sends the chat history to the database in the form
  [
    { user: "me", message: "Some message" },
    { user: "gpt", message: "Some message" },
    ...
  ]
  */
  async function sendChatLog(user, messages) {
    const username = localStorage.getItem("username");
    await fetch(`http://localhost:5050/history/${username}`, {
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
  // End of function that sends the chat log to the database

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

  // This function's code comes largely from this video
  // https://www.youtube.com/watch?v=qwM23_kF4v4
  async function handleSubmit(event) {
    event.preventDefault();

    // Code that handles user and gpt interaction
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);
    await sendChatLog("me", input);

    const messages = chatLogNew.map((message) => message.message).join("\n");

    const response = await fetch("http://localhost:5050/coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
      }),
    });

    const data = await response.json();

    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
    await sendChatLog("gpt", data.message);
  }

  // useEffect hook that enables scrolling
  useEffect(() => {
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chatLog]);
  // End of code that handles user and gpt interaction

  // Renders Coach.jsx component
  return (
    <div className={styles.coach}>
      <div className={styles.chatLogContainer} ref={chatLogRef}>
        <animated.h1 className={styles.coachTitle} style={greetings}>
          Welcome to your AI Coach!
          <span
            className={`${styles.icon} ${styles.infoLink} material-symbols-outlined`}
            onClick={openModal}
          >
            info
          </span>
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
  // End of Coach.jsx component
};

export default Coach;
