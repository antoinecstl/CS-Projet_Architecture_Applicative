# Architecture Applicative - Chat Application

## Introduction
This project is a web-based chat application built as part of the Architecture Applicative course at CentraleSupélec. The application features a client-server architecture for a chat forum.

## The Links :
```
Frontend and Backend hosted on https://render.com/ freeplan
Disclaimer: After 15 minutes of inactivity the backend is shutdown, when triggered back it needs a few minutes to start back...
```
- **Website**: https://cs-projet-architecture-applicative-rkp9.onrender.com/
- *Backend*: https://cs-projet-architecture-applicative.onrender.com


## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express.js

## Project Structure
```
Archi_Applicative/
│
├── Client/                  # Frontend
│   ├── index.html           # Main HTML structure 
│   ├── style.css            # CSS styling
│   └── script.js            # Client-side JavaScript logic
│
├── Server/                  # Backend
│   └── index.js             # Express server implementation
│
└── TP/                 
    └── README.md            # Project documentation
```

## Features
- **Message Board**: Post and view messages
- **Relative Timestamps**: Shows when messages were posted (e.g., "just now", "5 minutes ago")
- **Message Identification**: Link pseudonym to message
- **Delete Messages**: Remove messages from the board
- **Theme Toggle**: Switch between light and dark themes
- **Emoji Support**: Add emojis to your messages
- **Automatic Refresh**: Automaticly updates message board every 30 seconds

## API Endpoints

### Server API
- `GET /msg/getAll` - Get all messages
- `GET /msg/post/:message?pseudo=name` - Add a new message
- `GET /msg/del/:index` - Delete a message by index
- `GET /msg/get/:index` - Get a specific message by index
- `GET /msg/nber` - Get the total number of messages

## Styling and UX Features
- Animations for new messages
- Loading indicators
- Confirmation dialogs for destructive actions
- Responsive layout for various screen sizes
- Custom scrollbar styling

---
© - CS Architecture Applicative
