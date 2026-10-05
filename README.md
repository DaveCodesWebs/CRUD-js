# iPhone CRUD Application

A CRUD application for managing an iPhone inventory, built with **HTML, CSS, Bootstrap, and JavaScript**. The application uses **JSON Server** as a local REST API and provides a responsive interface for creating, viewing, editing, and deleting phone records.

## Features

- Create new iPhone records
- View iPhone inventory in a responsive table
- Edit individual records
- Delete individual records
- Bulk delete selected records
- Bulk edit multiple records
- Search phones by name, storage, or RAM
- Pagination
- Adjustable items per page
- Select all functionality
- Responsive UI with Bootstrap
- REST API integration using JSON Server

## Technologies

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- JSON Server
- Lucide Icons

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

Navigate to the project directory:

```bash
cd CRUD-iphones
```

Install the dependencies:

```bash
npm install
```

### Start the API Server

Run JSON Server with:

```bash
npm run server
```

The API will run locally at:

```text
http://localhost:3000/iphones
```

### Run the Application

Open `index.html` in your browser, or use a local development server such as the VS Code Live Server extension.

The application communicates with the local JSON Server API to perform CRUD operations.

## API

The application uses `db.json` as the local database.

The main endpoint is:

```text
GET    /iphones
POST   /iphones
PUT    /iphones/:id
DELETE /iphones/:id
```

## Project Structure

```text
CRUD-iphones/
├── index.html
├── style.css
├── db.json
├── package.json
├── package-lock.json
└── js/
    └── app.js
```

## Purpose

This project was developed to practice building a complete CRUD workflow with vanilla JavaScript, including asynchronous API requests, state management, search, pagination, selection handling, and bulk operations.

## Author

**David Dundo**
