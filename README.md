# HealthCoverSim

## Cloud-Based Health Insurance Quote Simulator

HealthCoverSim is a cloud-based web application that allows users to enter health insurance requirements and receive an estimated private health insurance premium.

The application provides a simple interface for creating, viewing, editing and deleting saved insurance quotes.

## Features

- Create health insurance quotes
- Calculate estimated insurance premiums
- Support for Single, Couple and Family cover
- Hospital cover options
- Extras cover options
- Monthly and yearly payment options
- Annual payment discount
- Lifetime Health Cover loading
- Input validation
- Optional notes
- View saved quotes
- Edit existing quotes
- Delete saved quotes
- REST API backend
- SQLite database
- Cloud deployment

## Technologies

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express
- CORS
- better-sqlite3

### Database

- SQLite

### Development and Deployment

- Git
- GitHub
- Render
- Ubuntu
- VMware

## Application Architecture

```text
User
  |
  v
React / Vite Frontend
  |
  | HTTP REST API
  v
Express / Node.js Backend
  |
  v
SQLite Database

HealthCoverSim/
│
├── backend/
│   ├── db.js
│   ├── init.sql
│   ├── server.js
│   ├── package.json
│   └── healthcoversim.db
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md