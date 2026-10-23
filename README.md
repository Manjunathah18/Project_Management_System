# Project Camp — Project Management System

Project Camp is a full-stack project management application for organizing projects, coordinating team members, tracking tasks and subtasks, and maintaining project notes. It includes a React frontend and a Node.js/Express REST API backed by MongoDB.

## Features

- **Authentication:** User registration and login, JWT-based authentication, email verification, token refresh, and password reset/change flows.
- **Project management:** Create and view projects, access project details, and manage project membership.
- **Team collaboration:** Add project members and manage their project roles.
- **Task management:** Create, assign, update, and track tasks with statuses such as Todo, In Progress, and Done.
- **Subtasks:** Break tasks into smaller items and track completion.
- **Project notes:** Create and manage notes associated with projects.
- **File attachments:** Backend support for task file uploads.
- **Access control:** Role-based permissions for administrators, project administrators, and members.
- **Responsive frontend:** React interface with reusable components and page navigation.

> Available actions depend on the user's role and the functionality implemented in the current version.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, React Router |
| Styling and UI | Tailwind CSS, CSS, Lucide React, React Hot Toast |
| API client | Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication and security | JSON Web Tokens (JWT), bcrypt |
| Validation and uploads | express-validator, Multer |
| Email | Nodemailer, Mailgen |
| Configuration | dotenv |

## Project Structure

```text
Projectmanagement1/
├── Backend/
│   ├── public/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Prerequisites

Install the following:

- [Node.js and npm](https://nodejs.org/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB instance
- Git

## Run Locally

Run the backend and frontend in separate terminals.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Replace the placeholder URL with your actual GitHub repository URL.

### 2. Configure and start the backend

```bash
cd Backend
npm install
```

Create a local `.env` file in `Backend/` by copying `.env.example`, then fill in your own configuration values.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the environment variables required by the backend, including:

- `PORT`
- `MONGO_URI`
- `CORS_ORIGIN`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `MAILTRAP_SMTP_HOST`
- `MAILTRAP_SMTP_PORT`
- `MAILTRAP_SMTP_USER`
- `MAILTRAP_SMTP_PASS`
- `SERVER_URL`
- `FORGOT_PASSWORD_REDIRECT_URL`

Use your own MongoDB connection string, email sandbox credentials, and strong random JWT secrets. Do not commit the `.env` file.

Start the backend in development mode:

```bash
npm run dev
```

The default backend port in the example configuration is `3000`.

### 3. Configure and start the frontend

Open a second terminal at the repository root:

```bash
cd frontend
npm install
```

Create `frontend/.env` and configure the API base URL:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal (typically `http://localhost:5173`).

### 4. Build the frontend

From the `frontend/` directory:

```bash
npm run build
```

## API Overview

The backend API uses the `/api/v1` prefix. Main route groups include:

| Route group | Purpose |
|---|---|
| `/api/v1/auth/` | Registration, login, verification, and account/password operations |
| `/api/v1/projects/` | Project and project-member management |
| `/api/v1/tasks/` | Tasks and subtasks |
| `/api/v1/notes/` | Project notes |
| `/api/v1/healthcheck/` | API health check |

The exact request payloads and permission requirements are defined in the backend route and controller files.

## Security Notes

- Keep `.env` files, database credentials, SMTP credentials, and JWT secrets out of Git.
- Commit `.env.example` only with placeholder values.
- If a real credential was accidentally pushed to GitHub or shared, rotate it; deleting the file in a later commit does not remove it from Git history.
- Do not use development secrets in production.

## Future Improvements

- Add automated unit and integration tests.
- Deploy the frontend and backend.
- Add CI checks and API documentation.
- Improve monitoring and application logging.

## Author

**Your Name**  
GitHub:Manjunatha H(https://github.com/Manjunathah18)



