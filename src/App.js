import React, { useEffect } from "react";
import popupFunction from "./popup";

function App() {
  useEffect(() => {
    console.log("Popup opened");
  }, []);

  function handleClick() {
    console.log("Button clicked");

    popupFunction();
  }

  return (
    <div className="App">
      <div className="popupContainer">
        <h1>Save URL</h1>
        <button id="addBtn" onClick={handleClick}>
          Add to my list
        </button>
      </div>
    </div>
  );
}

export default App;
