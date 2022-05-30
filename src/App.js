import userEvent from "@testing-library/user-event";
import React, { useState, useEffect } from "react";
import { MdOpenInNew } from "react-icons/md";

import Login from "./Login";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentTabURL, setCurrentTabURL] = useState("");
  const [progressMessage, setProgressMessage] = useState();

  useEffect(() => {
    console.log("Popup opened");

    /*global chrome*/
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //get URL of current tab
      let current_url = tabs[0].url;

      console.log(current_url);
      setCurrentTabURL(current_url);
    });

    getCurrentUser();

    // for running in full window with manual URL:
    // setCurrentTabURL(
    //   "https://medium.com/@satria.uno/why-ruby-on-rails-is-so-good-7e603cb63808"
    // );
  }, []);

  // determine end of week & month for current day:
  function determineDates(frequency) {
    const today = new Date();

    if (frequency === "weekly") {
      const lastDayOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 6)
      );
      return lastDayOfWeek;
    } else {
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      return lastDayOfMonth;
    }
  }

  // GET current User from local storage when popup is opened
  async function getCurrentUser() {
    try {
      const response = await fetch(`/me`);
      const userObj = await response.json();

      console.log("Current user: ", userObj);

      if (userObj.id) {
        setLoggedInUser(userObj);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // GET or CREATE weekly newsletter for current user
  async function getOrCreateNewsletter(frequency) {
    try {
      const response = await fetch(`/users/${loggedInUser.id}/newsletters`);
      const newslettersArray = await response.json();

      const unsentNewsletters = newslettersArray.filter(
        (nl) => nl.frequency === frequency && nl.sent === false
      );

      if (unsentNewsletters.length > 0) {
        const firstUnsent = unsentNewsletters[0];
        return firstUnsent;
      } else {
        console.log(`no unsent ${frequency} nl - create new`);
        return await createNewsletter(frequency);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function createNewsletter(frequency) {
    try {
      const response = await fetch(`/newsletters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          frequency: frequency,
          publish_date: determineDates(frequency),
          user_id: loggedInUser.id,
          sent: false,
        }),
      });
      const newsletterObj = await response.json();
      console.log(newsletterObj);
      return newsletterObj;
    } catch (error) {
      console.log(error.message);
    }
  }

  async function createArticle(frequency) {
    setProgressMessage("Saving article");

    try {
      const targetNewsletter = await getOrCreateNewsletter(frequency);

      console.log("target newsletter: ", targetNewsletter);

      const response = await fetch(`/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          url: currentTabURL,
          user_id: loggedInUser.id,
          newsletter_id: targetNewsletter.id,
          send_date: determineDates(frequency),
          priority: "normal",
        }),
      });
      const articleObj = await response.json();
      console.log(articleObj);

      setProgressMessage("Article saved");

      setTimeout(() => setProgressMessage(), 1000);
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleWeeklyClick() {
    console.log("Button clicked - weekly");

    createArticle("weekly");
  }

  function handleMonthlyClick() {
    console.log("Button clicked - monthly");

    createArticle("monthly");
  }

  return (
    <div className="App">
      <div className="popupContainer">
        <header>
          <h1 className="header">Forget Me Not</h1>
        </header>

        {loggedInUser ? (
          <div className="innerContainer" style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                zIndex: 100,
                top: 20,
                left: 0,
                right: 0,
                background: "white",
                transition: "1s ease all",
                opacity: progressMessage ? 1 : 0,
              }}
            >
              {progressMessage}
            </div>
            <h2>Hi, {loggedInUser.name}</h2>

            <div className="imageContainer">
              <button className="addBtn" onClick={handleWeeklyClick}>
                Add to Weekly Newsletter
              </button>
              <button className="addBtn" onClick={handleMonthlyClick}>
                Add to Monthly Newsletter
              </button>
            </div>
          </div>
        ) : (
          <div className="innerContainer">
            <Login
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          </div>
        )}

        <a
          href="http://localhost:4000"
          target="_blank"
          rel="noreferrer"
          className="appLink"
        >
          forgetmenot.app <MdOpenInNew />
        </a>
      </div>
    </div>
  );
}

export default App;
