import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import styles from "../css/password.module.css";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const history = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5050/reset-password", {email} );
      alert("Password reset email sent");
      history.push("/"); // Navigate to the login page or any other desired page
    } catch (error) {
      console.error("Error occurred while initiating password reset:", error.message);
      alert("An error occurred while initiating password reset");
    }
  };

  return (
    <div className={`d-flex justify-content-center align-items-center h-100 ${styles.passwordBody}`}>
      <div className={`card-body ${styles.passwordCard}`}>
        <h1 id={styles.passwordHeader}>Reset Password</h1>
        <form id={styles.password} onSubmit={handleSubmit}>
          <input
            type="email"
            id="email-input"
            className={`${styles.userInput}`}
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            size="30"
          />
          <input
            type="submit"
            id="submit-btn"
            value="Send reset link to email"
            className={styles.passwordBtn}
          />
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
