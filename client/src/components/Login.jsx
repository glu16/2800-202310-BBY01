import React from "react";
import "../css/login.css";

import{ useState} from "react";
import axois from "axios"; 

function Login() {

  //THE CODE FOR HOOKING UP THE BACKEND WITH THE FRONT WHEN WAS PRIMARLY FROM THIS VIDEO
//https://www.youtube.com/watch?v=HGgyd1bYWsE
  const [data, setData] = useState({
    email: "",
    password: ""
  });
const [error, setError] = useState("");

const handleSubmit = async(event) => {
  event.preventDefault();
  try{
    const url = "http://localhost:5000/api/auth";
    const {data:res} = await axois.post(url, data);
    localStorage.setItem("token", res.data);
    window.location = "/home";

  }catch(error){
    console.log(error);

    setError(error.response.data.message);
  }

}


const handleChange = ({currentTarget:input}) => {
  setData({...data, [input.name]: input.value});
};




  return (
    <div className="container loginContainer">
      <div className="login-card card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1>Login</h1>
            <form id="login" onSubmit={handleSubmit} >
              <label htmlFor="email-input"></label>
              <input
                type="email"
                id="email-input"
                className="user-input"
                placeholder="Email"
                name="email"
                value={data.email}
                onChange={handleChange}
                required
                size="30"
              />

              <label htmlFor="password-input"></label>
              <input
                type="password"
                id="password-input"
                className="user-input"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />

{error && <div>{error}</div>}

              <label htmlFor="submit-btn"></label>
              <input type="submit" id="login-btn" value="Login" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
