# ERP Auto Login Extension

This is a Chrome extension that automates the login process for the ERP website (https://erp.iitkgp.ac.in). The extension:
- Autofills your roll number and password.
- Automatically triggers the necessary events to fetch your security question.
- Autofills the security question answer based on your preconfigured responses.

> **Note:**  
> This extension is currently available as an open-source project. It can be installed by technically inclined users by loading it as an unpacked extension. For a one-click installation experience, the extension will be published on the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions) in the future.

## Features

- **Automated Autofill:**  
  Automatically fills in your roll number, password, and security question answer.

- **Background Communication:**  
  Uses a background script to securely fetch security questions from the ERP endpoint.

- **Local Storage:**  
  Saves your credentials and security answers using Chrome's storage API.

## Installation

### Steps to Install the Extension from GitHub

1. **Download or Clone the Repository:**

   - **Clone via Git:**  
     Open your terminal and run:
     ```bash
     git clone https://github.com/yourusername/erp-auto-login-extension.git
     ```
   - **Or Download as ZIP:**  
     Go to the repository page on GitHub and click on the **Code** button, then select **Download ZIP**. Extract the ZIP file to a folder on your computer.

2. **Load the Extension in Chrome:**

   - Open Google Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** by toggling the switch in the top-right corner.
   - Click on **Load unpacked**.
   - Select the folder where you have the extension files (the folder containing `manifest.json`).

3. **Configure the Extension:**

   - Click on the extension icon in Chrome's toolbar to open the popup.
   - Enter your roll number, password, and fetch your security questions.
   - Fill in the answers and click **Save Details**.
   - The extension is now configured and will autofill your ERP login page when you visit it.

## Contributing

Contributions are welcome! If you have ideas for improvements or bug fixes, please open an issue or submit a pull request.