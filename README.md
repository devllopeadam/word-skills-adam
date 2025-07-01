# World Skills Project - Anecdotes Application

## Developer
- **Name:** Adam Jeniah
- **Project:** Regional Competition Entry

## Project Overview
This is a full-stack application for sharing and voting on anecdotes. Users can share their experiences and vote on others' stories using different reaction types.

## Repository Structure
The project is split into two main parts:
```
/Competition_regionale_Adam_Jeniah_backend  - Laravel Backend API
/Competition_regionale_Adam_Jeniah_frontend - React Frontend
```

## Backend (Laravel)
The backend is built with Laravel, providing a robust REST API with the following features:

- User authentication and authorization
- CRUD operations for anecdotes
- Voting system with multiple reaction types
- Role-based access control
- Database migrations and seeders
- RESTful API endpoints

### Technical Stack
- PHP 8.x
- Laravel 10.x
- MySQL Database
- Laravel Sanctum for authentication
- Laravel Permissions for role management

### Key Features
- Secure user authentication
- Role-based authorization
- Anecdote management
- Voting system with multiple reaction types
- API rate limiting and security

## Frontend (React + Vite)
The frontend is a modern React application built with Vite, featuring:

- Modern and responsive UI
- Real-time vote updates
- Filtered view of anecdotes
- Mobile-friendly design
- Dark mode by default

### Technical Stack
- React 18
- Vite
- Modern JavaScript (ES6+)
- CSS-in-JS styling
- Responsive design principles

### Key Features
- Intuitive user interface
- Responsive design for all devices
- Dynamic vote interactions
- Category filtering
- Clean and modern dark theme

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
```bash
cd Competition_regionale_Adam_Jeniah_backend
```
2. Install dependencies:
```bash
composer install
```
3. Set up environment:
```bash
cp .env.example .env
php artisan key:generate
```
4. Run migrations:
```bash
php artisan migrate
```
5. Start the server:
```bash
php artisan serve
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd Competition_regionale_Adam_Jeniah_frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Features
- User registration and authentication
- Create, read, update, and delete anecdotes
- Vote on anecdotes with different reactions:
  - Wow
  - Excellent
  - Technique
  - Bof
- Filter anecdotes by category
- Responsive design for mobile and desktop
- Dark mode interface

## License
This project is part of a World Skills competition entry and is proprietary to Adam Jeniah.
