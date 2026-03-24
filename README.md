# AI Flow App (React Flow + Node + OpenRouter + MongoDB)

An interactive **AI workflow builder** built using **React Flow**, where users can input a prompt, send it to an AI model via backend, and visualize the response inside a connected node. The app also allows saving prompt-response pairs to a MongoDB database.

---

## Features

- Visual flow using **React Flow**
- Input node for user queries
- AI-powered response node
- Backend API using **Node.js + Express**
- Free AI models via **OpenRouter**
- Save responses to **MongoDB**
- Auto-resizing nodes based on content
- Dynamic UI updates
- Clean and extendable architecture

---

## Tech Stack

### Frontend

- React
- React Flow (`@xyflow/react`)
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- Axios

### Database

- MongoDB (Mongoose)

### AI API

- OpenRouter (Free Models)

---

## 📁 Project Structure

```
project-root/
│
├── my-react-flow-app/src
│   └── App.jsx
│
├── backend/
│   ├── server.js
│   ├── .env
│   ├── models/
│   │   └── Chat.js
│   └── routes/
│       └── aiRoutes.js
```

---

## Setup Instructions

---

### 🔹 1. Clone the Repository

```
git clone <your-repo-url>
cd project-root

```

---

### 🔹 2. Backend Setup

```
cd backend
npm install

```

Create `.env` file:

```
PORT=5000
OPENROUTER_API_KEY=your_api_key_here
MONGO_URI=mongodb://127.0.0.1:27017/reactflow

```

Start backend:

```
node server.js
```

---

### 3. Frontend Setup

```
cd my-react-flow-app
npm install
npm run dev

```

---

## API Endpoints

### Ask AI

```
POST /api/ask-ai

```

**Request:**

```json
{
  "prompt": "What is the capital of France?"
}
```

**Response:**

```json
{
  "result": "Paris is the capital of France."
}
```

---

### Save Chat

```
POST /api/save

```

**Request:**

```json
{
  "prompt": "Your question",
  "response": "AI answer"
}
```

---

## Free AI Models (OpenRouter)

You can use:

- `google/gemini-2.0-flash-lite-preview-02-05:free` ✅ (Recommended)
- `openchat/openchat-7b:free`

> ⚠️ Free models may change or become unavailable.

---

## How It Works

1. User types a prompt in the **Input Node**
2. Clicks **Run Flow**
3. Frontend sends request to backend
4. Backend calls OpenRouter API
5. AI response is returned
6. Response is displayed in **Result Node**
7. User can click **Save** to store in MongoDB

---

## UI Highlights

- Auto-resizing nodes based on content
- Text wrapping and scroll for long responses
- Smooth flow visualization
- Interactive node connections
- Responsive layout

---

## Why Backend is Used

- Protects API key from exposure
- Handles API requests securely
- Enables database integration

### MongoDB Error

- Ensure MongoDB is running
- Check `MONGO_URI`

### 401 Unauthorized

- Verify OpenRouter API key

### Model Not Found

- Switch to another free model

---

## Notes

- Always restart server after updating `.env`
- Free models may be rate-limited
- Keep API keys secure

---
