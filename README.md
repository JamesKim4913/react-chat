# React Chat App

Real-time chat application using React, Vite, and Firebase.

## Getting Started 

1. Clone the project.

```bash
git clone https://github.com/JamesKim4913/react-chat.git
```

1. Navigate to the project directory:
```bash
cd firebase-chat-app
```

1. Install the required packages:
```bash
npm install
```

1. Set up your Firebase project: 
	Create a new project in the Firebase console and add a web app. Copy the generated configuration object and paste it into the src/firebaseConfig.js file.
```bash
// src/firebaseConfig.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

export default firebaseConfig;

```

1. Run the application:
```bash
npm run dev
```

	The application will be running at http://localhost:5173/

### Features 
	*  Users can log in to join chat rooms.
	*  Real-time updates show new messages as they come in, allowing users to see the chat conversation.
	*  Users can input and send messages.

### Contributing
	Thank you for your interest in contributing to this project! Any contributions are welcome. Whether it's bug reports, feature suggestions, or code improvements, feel free to submit a Pull Request.

### License
	This project is licensed under the MIT License.

### Screenshot  
![Screenshot](https://github.com/JamesKim4913/react-chat/blob/b085435a20fcf251d47aa3b09efe6e31b7bae33c/screenshot/ani.gif)  