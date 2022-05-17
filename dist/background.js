/*global chrome*/
chrome.runtime.onInstalled.addListener(() => {
  // default state goes here:
  //     // this runs ONE TIME ONLY (unless the user reinstalls your extension)
  console.log("Chrome extension successfully installed!");
  return;
});

// from Google documentation: does it do anything?
// async function getCurrentTab() {
//   let queryOptions = { active: true, currentWindow: true };
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
// }

// if you need to access initial data past de-activation
// set state:
// chrome.storage.local.set({
//     name: "Jack"
// }, function ());

// getting state:
// chrome.storage.local.get("name", function (retrieved_data));

// get the tab that this script call is being made from:
// chrome.tabs.getCurrent(
//     callback?: function,
//   )
