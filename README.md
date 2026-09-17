# BLOODLINK

## Blood Donor and Recipient Matching System

BloodLink is a college final-year project designed to connect blood
recipients with available blood donors through a secure web application.

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- Socket.IO

### Database
- PostgreSQL
- Prisma ORM

### Authentication & Security
- JWT / secure session authentication
- Password hashing
- Input validation
- Role-based authorization
- Security headers
- Rate limiting
- CORS configuration

## Main User Roles

### Donor
Donors can:
- Create a donor profile
- Select blood group
- Set district and location
- Change availability
- View contact requests
- Communicate with recipients

### Recipient
Recipients can:
- Search for available donors
- Filter by blood group and district
- View donor information
- Contact donors
- Chat with donors

### Administrator
Administrators can:
- Manage users
- Manage donor accounts
- View statistics
- Handle reports
- Disable suspicious accounts

## Project Architecture

React Frontend
        |
        | REST API
        v
Node.js + Express Backend
        |
        +---- PostgreSQL
        |
        +---- Prisma ORM
        |
        +---- Socket.IO

## Medical Safety Notice

This platform helps recipients discover and contact potential blood
donors. It does not determine medical eligibility or replace
professional medical advice.

Actual donor eligibility, blood compatibility, blood testing,
crossmatching, and transfusion decisions must be confirmed by qualified
healthcare professionals or blood banks.

## Development Status

Phase 1 - Project Initialization

- [x] Project directory
- [x] Frontend initialization
- [x] Backend initialization
- [x] Initial architecture
- [x] Environment template
- [x] Git configuration

## Future Phases

- Frontend development
- Backend API development
- Database integration
- Authentication
- Role-based authorization
- Donor profiles
- Recipient profiles
- Matching engine
- Chat
- Notifications
- Admin dashboard
- Testing
- Deployment