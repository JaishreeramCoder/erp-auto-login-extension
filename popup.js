// DOM Elements
const fetchQuestionsBtn = document.getElementById("fetch-questions");
const securitySection = document.getElementById("security-section");
const messageDiv = document.getElementById("message");
const setupForm = document.getElementById("setup-form");
const resetBtn = document.getElementById("reset-btn");

const rollnoInput = document.getElementById("rollno");
const passwordInput = document.getElementById("password");

const questionLabels = [
  document.getElementById("question1-label"),
  document.getElementById("question2-label"),
  document.getElementById("question3-label")
];

const answerInputs = [
  document.getElementById("answer1"),
  document.getElementById("answer2"),
  document.getElementById("answer3")
];

// To store unique security questions during the session.
let uniqueQuestions = new Set();

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("erpDetails", (data) => {
      if (data.erpDetails) {
        const { rollno, password, securityQA } = data.erpDetails;
        rollnoInput.value = rollno;
        passwordInput.value = password;
        messageDiv.textContent =
          "Details are already saved. You can reset them if you want to change.";
  
        // If securityQA exists and has three entries, display them.
        if (securityQA && securityQA.length === 3) {
          // Populate the security questions section and answers.
          securitySection.classList.remove("hidden");
          securityQA.forEach((item, index) => {
            questionLabels[index].textContent = item.question;
            answerInputs[index].value = item.answer;
            uniqueQuestions.add(item.question);
          });
        }
      }
    });
});  

/**
 * Modified function to fetch a security question using the background script.
 */
async function fetchSecurityQuestion(rollno) {
  try {
    const question = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "FETCH_QUESTION", rollno }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (response.error) {
          reject(response.error);
        } else {
          resolve(response.question);
        }
      });
    });
    return question;
  } catch (error) {
    console.error("Error fetching security question:", error);
    return null;
  }
}

// Function to fetch three unique security questions
async function fetchUniqueQuestions(rollno) {
  uniqueQuestions.clear();
  let attempts = 0;
  // Limit attempts to avoid infinite loops.
  while (uniqueQuestions.size < 3 && attempts < 10) {
    const question = await fetchSecurityQuestion(rollno);
    if (question && !uniqueQuestions.has(question)) {
      uniqueQuestions.add(question);
      // Update the corresponding label in the UI.
      const index = Array.from(uniqueQuestions).length - 1;
      questionLabels[index].textContent = question;
    }
    attempts++;
  }
  // Return true if three questions have been collected.
  return uniqueQuestions.size === 3;
}

// Event Listener for Fetch Security Questions button
fetchQuestionsBtn.addEventListener("click", async () => {
  const rollno = rollnoInput.value.trim();
  if (!rollno) {
    messageDiv.textContent = "Please enter your roll number first.";
    return;
  }
  messageDiv.textContent = "Fetching security questions...";
  fetchQuestionsBtn.disabled = true;

  const success = await fetchUniqueQuestions(rollno);
  if (success) {
    securitySection.classList.remove("hidden");
    messageDiv.textContent = "Security questions loaded. Please answer them below.";
  } else {
    messageDiv.textContent = "Could not fetch 3 unique questions. Please try again.";
  }
  fetchQuestionsBtn.disabled = false;
});

// Event Listener for form submission
setupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const rollno = rollnoInput.value.trim();
  const password = passwordInput.value.trim();

  // Convert the set to an array to use numeric indices.
  const questionsArray = Array.from(uniqueQuestions);
  const questionsAndAnswers = [];

  for (let i = 0; i < questionsArray.length; i++) {
    const answer = answerInputs[i].value.trim();
    if (!answer) {
      messageDiv.textContent = "Please answer all security questions.";
      return;
    }
    questionsAndAnswers.push({ question: questionsArray[i], answer: answer });
  }

  if (!rollno || !password || questionsAndAnswers.length !== 3) {
    messageDiv.textContent =
      "Please fill out all fields and ensure security questions are answered.";
    return;
  }

  // Save details to chrome.storage.local.
  chrome.storage.local.set(
    {
      erpDetails: {
        rollno,
        password,
        securityQA: questionsAndAnswers
      }
    },
    () => {
      messageDiv.textContent = "Details saved successfully!";
    }
  );
});

// Event Listener for Reset button
resetBtn.addEventListener("click", () => {
  chrome.storage.local.remove("erpDetails", () => {
    messageDiv.textContent = "Details reset. Please fill in your details again.";
    setupForm.reset();
    securitySection.classList.add("hidden");
    uniqueQuestions.clear();
    questionLabels.forEach((label) => (label.textContent = ""));
    answerInputs.forEach((input) => (input.value = ""));
  });
});
