// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FETCH_QUESTION") {
      const rollno = message.rollno;
      fetch("https://erp.iitkgp.ac.in/SSOAdministration/getSecurityQues.htm", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ user_id: rollno }).toString(),
      })
        .then((response) => response.text())
        .then((data) => {
          sendResponse({ question: data.trim() });
        })
        .catch((error) => {
          console.error("Error fetching security question:", error);
          sendResponse({ error: error.toString() });
        });
      // Return true to indicate that the response will be sent asynchronously.
      return true;
    }
});
  