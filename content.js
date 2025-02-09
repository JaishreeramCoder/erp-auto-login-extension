// content.js

function initialize() {
    // Retrieve the stored ERP details from chrome.storage.local.
    chrome.storage.local.get("erpDetails", (data) => {
      if (!data.erpDetails) {
        console.warn("No ERP details found in storage.");
        return;
      }
  
      const { rollno, password, securityQA } = data.erpDetails;
      if (!rollno || !password || !securityQA || securityQA.length !== 3) {
        console.warn("Incomplete ERP details found in storage.");
        return;
      }
  
      // Autofill the roll number and password inputs.
      const userIdInput = document.getElementById("user_id");
      const passwordInput = document.getElementById("password");
      if (!userIdInput || !passwordInput) {
        console.error("User ID or password input not found on the page.");
        return;
      }
      
      userIdInput.value = rollno;
      passwordInput.value = password;
  
      // Trigger a blur event on the user_id input to initiate the backend request for the security question.
      // Then, remove focus from it so that subsequent clicks (e.g., on the OTP button) don't cause a re-trigger.
      userIdInput.dispatchEvent(new Event("blur"));
      userIdInput.blur();
  
      // Locate the security question label and the answer input.
      const questionLabel = document.getElementById("question");
      if (!questionLabel) {
        console.error("Security question label (id='question') not found on the page.");
        return;
      }
      
      const answerInput = document.getElementById("answer");
      if (!answerInput) {
        console.error("Answer input (id='answer') not found on the page.");
        return;
      }
  
      // Create a MutationObserver to watch for changes in the security question text.
      // This observer stays active so that whenever the question text changes,
      // the code finds the matching answer from securityQA and updates the answer input.
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" || mutation.type === "characterData") {
            const questionText = questionLabel.textContent.trim();
            if (questionText.length > 0) {
              // Find the matching answer from the stored securityQA mapping.
              let matchingAnswer = "";
              for (const qa of securityQA) {
                // For a robust match, consider using case-insensitive comparison if needed.
                if (questionText === qa.question) {
                  matchingAnswer = qa.answer;
                  break;
                }
              }
              // Update the answer input with the matching answer.
              answerInput.value = matchingAnswer;
            }
          }
        });
      });
  
      observer.observe(questionLabel, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });
  }
  
  // Check if the DOM is already loaded; if so, initialize immediately. Otherwise, wait for DOMContentLoaded.
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initialize();
  } else {
    document.addEventListener("DOMContentLoaded", initialize);
  }
  