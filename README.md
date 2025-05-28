# 🩺 Dr. Nimal's Tasks – React Native Todo App

A simple, elegant, and powerful mobile application designed for Dr. Nimal — a busy professional who needs to manage a hectic schedule efficiently. This React Native app, built using Expo and Expo Router, connects with a RESTful API to provide full CRUD functionality for task management. It offers a clean interface with a smooth user experience tailored for productivity on mobile devices.

---

## 🧠 Problem Statement

Dr. Nimal needs a reliable and intuitive solution to keep track of daily tasks from his mobile device. This app addresses that need with an elegant task manager that's fast, easy to use, and always accessible.

---

## ✨ Features

- ✅ View all tasks
- ➕ Add new tasks (title & description)
- 📝 Edit existing tasks
- ❌ Delete tasks
- 🔁 Pull-to-refresh for live updates
- 🧭 Seamless navigation with Expo Router
- ☁️ Full sync with REST API
- 📱 Fully mobile-friendly UI built for speed and clarity

---

## 🚀 Technologies Used

| Category    | Tool/Library                |
| ----------- | --------------------------- |
| Framework   | [React Native]              |
| Runtime     | [Expo]                      |
| Navigation  | [Expo Router]               |
| HTTP Client | Axios (`axios`)             |
| Styling     | CSS Modules / Native Styles |
| Design Tool | [Figma]                     |

---

## 📁 Project Structure

todo_App/
├── app/
│ ├── \_layout.tsx # Root layout and navigation
│ ├── index.tsx # Home screen
│ ├── tasks.tsx # Task screen
│ ├── addNew.tsx # Add task screen
│ ├── calender.tsx # Calendar view
│ └── updateTask/
│ └── [taskId].tsx # Update task
│
├── components/ # Reusable components
│ └── laypot/
│ ├── Footer.tsx
│ └── Header.tsx
│ └── Service/
│ └── getTasks.tsx
│
├── context/ # Context API for state (Not used in this project)
├── types/ # TypeScript types
├── assets/ # Fonts and icons
├── app.config.ts # Expo configuration
└── README.md

---

## 🔗 API Integration

> Base URL: `https://60a21a08745cd70017576014.mockapi.io/api/v1`

| Method | Endpoint  | Description            |
| ------ | --------- | ---------------------- |
| GET    | /todo     | Fetch all todos        |
| GET    | /todo/:id | Get specific todo      |
| POST   | /todo     | Create a new todo      |
| PUT    | /todo/:id | Update a specific todo |
| DELETE | /todo/:id | Delete a todo          |

> Sample POST body:

```json
{
  "title": "New Task",
  "description": "Task details go here"
}

##✅ Task Validation Rules
To ensure consistent and meaningful task data, the app includes input validation:

Title:
Required field
Minimum length: 3 characters
Maximum length: 50 characters
Description : no validations
The form will not submit if validation fails, and clear error messages are shown to the user.

🧪 Setup Instructions
1. Clone the Repository
git clone https://github.com/ChamodSathsara/todoapp_react_native.git
cd dr-nimals-tasks

2. Install Dependencies
npm install

3. Run the Project
npx expo start

🎨 UI/UX Design
Built using Figma link- https://www.figma.com/design/rdXIIiYFiSuTyspMbFecxF/todo-App?node-id=0-1&t=zlxsdCJ0KCK84BvT-1

High-fidelity UI designs and wireframes are included in the design/ directory

Screens include: Home,Tasks, Add Task, Edit Task, Calendar

📌 Assumptions
Authentication is not required
Tasks include only title and description
No offline storage (via REST API)
No dark mode included in this version
```
