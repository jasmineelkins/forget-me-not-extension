import userEvent from "@testing-library/user-event";
import React, { useState, useEffect } from "react";
import { MdOpenInNew } from "react-icons/md";

import Login from "./Login";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentTabURL, setCurrentTabURL] = useState("");

  const [weeklyReadByDate, setWeeklyReadByDate] = useState();
  const [monthlyReadByDate, setMonthlyReadByDate] = useState();

  const [newsletterID, setNewsletterID] = useState();

  useEffect(() => {
    // console.log("Popup opened");

    // /*global chrome*/
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   //get URL of current tab
    //   let current_url = tabs[0].url;

    //   console.log(current_url);
    //   setCurrentTabURL(current_url);

    // GET current User from local storage when popup is opened
    fetch(`/me`)
      .then((res) => res.json())
      .then((userObj) => {
        console.log("Current user: ", userObj);

        if (userObj.id) {
          console.log("User's name: ", userObj.name);

          setLoggedInUser(userObj);
        }
      })
      .catch((error) => console.log(error.message));
    // });

    console.log("Window opened");

    // for now, open in full window with manual URL:
    setCurrentTabURL("unicorn");

    // default, set read-by date to end of current week:
    const today = new Date();
    // const firstDayOfWeek = new Date(
    //   today.setDate(today.getDate() - today.getDay())
    // );
    const lastDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    // console.log("Start of the week: ", firstDayOfWeek);
    console.log("End of the week: ", lastDayOfWeek);

    setWeeklyReadByDate(lastDayOfWeek);

    // configure end of monthly date, use only if monthly button clicked
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    console.log("Last day of the month: ", lastDayOfMonth);

    setMonthlyReadByDate(lastDayOfMonth);
  }, []);

  function handleWeeklyClick() {
    console.log("Button clicked - weekly");

    const { id } = loggedInUser;

    // first, check if unsent weekly Newsletter exists
    fetch(`/users/${id}/newsletters`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((newslettersArray) => {
        console.log("Newsletter Array: ", newslettersArray); // this is working

        if (newslettersArray > 0) {
          console.log("not empty");
          // const unsentNewsletters = newslettersArray.filter(
          //   (nl) => nl.type === "weekly" && nl.sent === false
          // );
          // const firstUnsent = unsentNewsletters[0];
          // setNewsletterID(firstUnsent.id);
        } else {
          console.log("empty");
          console.log(loggedInUser.id);
          // create new newsletter
          // fetch(`http://localhost:3000/newsletters`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //     Accept: "application/json",
          //   },
          //   body: JSON.stringify({
          //     type: "weekly",
          //     publish_date: weeklyReadByDate,
          //     user_id: loggedInUser.id,
          //     sent: false,
          //   }),
          // })
          //   .then((res) => res.json())
          //   .then((newNewsletterObj) => {
          //     console.log(newNewsletterObj);
          //     // setNewsletterID(newNewsletterObj.id);
          //   })
          //   .catch((error) => console.log(error.message));
        }

        //  POST create new Article with url and user_id
        // fetch(`http://localhost:3000/articles`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Accept: "application/json",
        //   },
        //   body: JSON.stringify({
        //     url: currentTabURL,
        //     user_id: loggedInUser.id,
        //     newsletter_id: newsletterID,
        //     read_by_date: weeklyReadByDate,
        //   }),
        // })
        //   .then((res) => res.json())
        //   .then((newArticlObj) =>
        //     console.log("Article created: ", newArticlObj)
        //   )
        //   .catch((error) => console.log(error.message));
      })
      .catch((error) => console.log(error.message));

    // if not, create it

    // POST create new Article with url and user_id
    //   fetch(`http://localhost:3000/articles`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //     body: JSON.stringify({
    //       url: currentTabURL,
    //       user_id: loggedInUser.id,
    //       newsletter_id: ,
    //       read_by_date: weeklyReadByDate,
    //     }),
    //   })
    //     .then((res) => res.json())
    //     .then((newArticlObj) => console.log("Article created: ", newArticlObj))
    //     .catch((error) => console.log(error.message));
  }

  function handleMonthlyClick() {
    console.log("Button clicked - monthly");

    // POST create new Article with url and user_id **MONTHLY READ-BY DATE**
    // fetch(`http://localhost:3000/articles`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //   },
    //   body: JSON.stringify({
    //     url: currentTabURL,
    //     user_id: loggedInUser.id,
    //     newsletter_id: 1,
    //     read_by_date: monthlyReadByDate,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((newArticlObj) => console.log("Article created: ", newArticlObj))
    //   .catch((error) => console.log(error.message));
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
