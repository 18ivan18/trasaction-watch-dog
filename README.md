# Task Management API

A RESTful API for managing tasks built with Express, Sequelize, and Awilix DI.

## Features

- CRUD operations for tasks
- SQLite database with Sequelize ORM
- Dependency injection with Awilix
- TypeScript support

## Setup

1. Install dependencies:

```bash
npm install
```

2. Seed the database with initial data:

```bash
npm run seed
```

3. Start the development server:

```bash
npm run dev
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## API Endpoints

### Tasks

- `GET /tasks/all` - Get all tasks
- `GET /tasks/:id` - Get a specific task by ID
- `POST /tasks` - Create a new task
  - Body: `{ "name": "task name", "done": false }`
- `PUT /tasks/:id` - Update a task
  - Body: `{ "name": "updated name", "done": true }`
- `DELETE /tasks/:id` - Delete a task

### Example Usage

```bash
# Get all tasks
curl http://localhost:3000/tasks/all

# Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"name": "learn typescript", "done": false}'

# Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/1
```

## Project Structure

```
src/
├── controllers/     # Route controllers
├── models/         # Sequelize models
├── services/       # Business logic and database services
├── container.ts    # Awilix DI container configuration
└── index.ts        # Application entry point
```

## Database

The application uses SQLite with Sequelize ORM. The database file (`database.sqlite`) is created automatically when you first run the application or seed script.
