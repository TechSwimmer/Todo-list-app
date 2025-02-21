# TaskNest

### Description

TaskNest is a simple and intuitive todo application designed to help users efficiently manage their daily tasks. Users can add, edit, and delete tasks, as well as mark them as completed. The app features a calendar view to organize tasks by date and provides authentication to ensure that each user's tasks remain private and secure.

### Features

* Add tasks with due dates

* View tasks in a calendar format

* Mark tasks as completed

* Delete individual tasks or clear all tasks

* Filter tasks based on status (completed/pending)




## Tech Stack


### Frontend

* HTML, CSS, JavaScript

* React.js

* Context API (for state management)


### Backend

* Node.js

* Express.js

* MongoDB (MongoDB Atlas)



## Installation and Setup

### Prerequisites

* Node.js installed

* MongoDB Atlas or a local MongoDB database set up

### Clone the Repository

* git clone https://github.com/your-username/tasknest.git
* cd tasknest

### Backend Setup

* Navigate to the backend folder:
  * cd backend

* Install dependencies:
  * npm install

* Create a .env file and add the following environment variables:
  * MONGO_URI=your_mongodb_connection_string
  * JWT_SECRET=your_secret_key

* Start the backend server:
  * npm start

### Frontend Setup

* Navigate to the frontend folder:
  * cd frontend

* Install dependencies:
  * npm install

* Start the frontend development server:
  * npm run dev

### Deployment

TaskNest can be deployed using:

* #### Frontend: Netlify / Vercel

* #### Backend: Render / Heroku

### Deploying the Backend

* Push the backend code to GitHub.

* Deploy it on Render (or any hosting platform supporting Node.js).

* Update the frontend API URL to point to the deployed backend.

### Deploying the Frontend

* Push the frontend code to GitHub.

* Deploy it on Netlify/Vercel.

* Ensure the backend URL is correctly set in API requests.

### API Endpoints

#### Authentication

* POST /register - User signup

* POST /login - User login

### Tasks

* GET /tasks - Fetch all tasks for the authenticated user

* POST /tasks - Create a new task

* PUT /tasks/:id - Update a task

* DELETE /tasks/:id - Delete a task

### Contributing

* Contributions are welcome! Feel free to fork the repository and submit a pull request.

### License

* This project is open-source and available under the MIT License.

# Contact

*For any queries, reach out via https://techdevnikhil.netlify.app/.