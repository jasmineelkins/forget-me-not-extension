import React, { useContext, useState } from "react";

// ****** unfinished ***** \\

const usePopupFunction = function () {
  const [loggedInUser, setLoggedInUser] = useState(null);

  console.log("Popup.js triggered");
  console.log("Button clicked");

  /*global chrome*/
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //get URL of current tab
    let current_url = tabs[0].url;

    console.log(current_url);

    // GET current User:
    fetch(`http://localhost:3000/me`)
      .then((res) => res.json())
      .then((userObj) => {
        console.log("Current user: ", userObj);
        setLoggedInUser(userObj);

        // POST create new Article with url and user_id
        fetch(`http://localhost:3000/articles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            url: current_url,
            user_id: userObj.id,
            newsletter_id: 1,
          }),
        })
          .then((res) => res.json())
          .then((newArticlObj) =>
            console.log("Article created: ", newArticlObj)
          )
          .catch((error) => console.log(error.message));
      })
      .catch((error) => console.log(error.message));
  });
};

export default usePopupFunction;
