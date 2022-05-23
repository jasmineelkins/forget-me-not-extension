import userEvent from "@testing-library/user-event";
import React, { useState, useEffect } from "react";
import usePopupFunction from "./usePopupFunction";
import Login from "./Login";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentTabURL, setCurrentTabURL] = useState("");
  const [readByDate, setReadByDate] = useState();

  useEffect(() => {
    console.log("Popup opened");

    /*global chrome*/
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //get URL of current tab
      let current_url = tabs[0].url;

      console.log(current_url);
      setCurrentTabURL(current_url);

      // GET current User from local storage when popup is opened
      fetch(`http://localhost:3000/me`)
        .then((res) => res.json())
        .then((userObj) => {
          console.log("Current user: ", userObj);

          if (userObj.id) {
            console.log("User's name: ", userObj.name);

            setLoggedInUser(userObj);
          }
        })
        .catch((error) => console.log(error.message));
    });

    // default, set read-by date to end of current week:
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDay = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    console.log("Start of the week: ", firstDay);
    console.log("End of the week: ", lastDay);

    setReadByDate(lastDay);
  }, []);

  function handleClick() {
    console.log("Button clicked");

    // POST create new Article with url and user_id
    fetch(`http://localhost:3000/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        url: currentTabURL,
        user_id: loggedInUser.id,
        newsletter_id: 1,
        read_by_date: readByDate,
      }),
    })
      .then((res) => res.json())
      .then((newArticlObj) => console.log("Article created: ", newArticlObj))
      .catch((error) => console.log(error.message));
  }

  return (
    <div className="App">
      <div className="popupContainer">
        <header>
          <h1 className="header">Forget Me Not</h1>
        </header>

        {loggedInUser ? (
          <div className="innerContainer">
            <h2>Hi, {loggedInUser.name}</h2>

            <div class="imageContainer">
              <button id="addBtn" onClick={handleClick}>
                Add to Weekly Newsletter
              </button>
              {/* <div className="">
              <label>Custom date:</label>
              <input></input>
            </div>  */}
            </div>
          </div>
        ) : (
          <div className="innerContainer">
            {/* <h2>Hi there!</h2>
            <span>Please follow the link to log in.</span> */}
            <Login
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          </div>
        )}

        <a href="http://localhost:4000" target="_blank" rel="noreferrer">
          forgetmenot.app
        </a>
      </div>
    </div>
  );
}

export default App;
