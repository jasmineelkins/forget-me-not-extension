import userEvent from "@testing-library/user-event";
import React, { useState, useEffect } from "react";
import { MdOpenInNew } from "react-icons/md";

import Login from "./Login";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentTabURL, setCurrentTabURL] = useState("");

  const [weeklyReadByDate, setWeeklyReadByDate] = useState();
  const [monthlyReadByDate, setMonthlyReadByDate] = useState();

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
  async function getOrCreateWeeklyNewsletter() {
    try {
      const response = await fetch(`/users/${loggedInUser.id}/newsletters`);
      const newslettersArray = await response.json();

      if (newslettersArray.length > 0) {
        console.log("not empty");
        const unsentNewsletters = newslettersArray.filter(
          (nl) => nl.frequency === "weekly" && nl.sent === false
        );

        if (unsentNewsletters.length > 0) {
          const firstUnsent = unsentNewsletters[0];
          return firstUnsent;
        } else {
          console.log("no unsent weekly nl - create new");
          return await createNewsletter();
        }
      } else {
        console.log("empty");

        // create new newsletter
        return await createNewsletter();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function createNewsletter() {
    try {
      const response = await fetch(`/newsletters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          frequency: "weekly",
          publish_date: weeklyReadByDate,
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

  async function createArticle() {
    try {
      const targetNewsletter = await getOrCreateWeeklyNewsletter();

      console.log(targetNewsletter);

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
          read_by_date: weeklyReadByDate,
        }),
      });
      const articleObj = await response.json();
      console.log(articleObj);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    // console.log("Popup opened");

    // /*global chrome*/
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   //get URL of current tab
    //   let current_url = tabs[0].url;

    //   console.log(current_url);
    //   setCurrentTabURL(current_url);

    getCurrentUser();

    // for now, open in full window with manual URL:
    setCurrentTabURL(
      "https://medium.com/@satria.uno/why-ruby-on-rails-is-so-good-7e603cb63808"
    );

    // default, set read-by date to end of current week:
    const today = new Date();
    // const firstDayOfWeek = new Date(
    //   today.setDate(today.getDate() - today.getDay())
    // );
    const lastDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    // console.log("Start of the week: ", firstDayOfWeek);
    // console.log("End of the week: ", lastDayOfWeek);

    setWeeklyReadByDate(lastDayOfWeek);

    // configure end of monthly date, use only if monthly button clicked
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    // console.log("Last day of the month: ", lastDayOfMonth);

    setMonthlyReadByDate(lastDayOfMonth);
  }, []);

  function handleWeeklyClick() {
    console.log("Button clicked - weekly");

    // next add parameter: weekly or monthly
    createArticle();
  }

  function handleMonthlyClick() {
    console.log("Button clicked - monthly");

    // POST create new Article with url and user_id **MONTHLY READ-BY DATE**
    // createArticle(monthly)
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
