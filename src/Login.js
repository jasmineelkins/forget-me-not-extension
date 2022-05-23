import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";

const defaultFormState = { username: "", password: "" };

function Login({ loggedInUser, setLoggedInUser }) {
  const [formData, setFormData] = useState(defaultFormState);
  const [passwordShown, setPasswordShown] = useState(false);
  const [error, setError] = useState(null);

  //   const navigate = useNavigate();

  const passwordShownIcon =
    passwordShown === true ? <AiFillEye /> : <AiFillEyeInvisible />;

  function togglePassword(e) {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // POST request: log in user by creating a session
    fetch(`http://localhost:3000/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    })
      .then((res) => res.json())
      .then((userObj) => {
        console.log("Logged in user: ", userObj);

        if (userObj.username) {
          setLoggedInUser(userObj);
          setError(null);
        } else {
          if (userObj.error) {
            setError(userObj.error.login);
          } else {
            setError(null);
          }

          setLoggedInUser(null);
        }
      })
      .catch((error) => console.log(error.message));

    // reset form
    setFormData(defaultFormState);
  }

  const errorsToDisplay = error === null ? null : error;

  return (
    <div className="authFormContainer">
      <form onSubmit={(e) => handleSubmit(e)} className="authForm">
        <div className="formRow">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={(e) => handleChange(e)}
          ></input>
        </div>

        <div className="formRow">
          <label>Password</label>
          <input
            type={passwordShown ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) => handleChange(e)}
          ></input>
        </div>

        <div className="formButtonDiv">
          <button onClick={(e) => togglePassword(e)}>
            {passwordShownIcon}
          </button>
          <button type="submit">Submit</button>
        </div>

        <span className="errorMessage">{errorsToDisplay}</span>
      </form>
    </div>
  );
}

export default Login;
