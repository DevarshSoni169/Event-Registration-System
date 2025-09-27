Event Registration System 
A complete full-stack event registration system with real-time capacity management, waitlisting, and comprehensive admin controls. Built with modern technologies for a seamless user experience.

https://img.shields.io/badge/React-18.2.0-blue
https://img.shields.io/badge/Node.js-Express-brightgreen
https://img.shields.io/badge/MongoDB-Database-green
https://img.shields.io/badge/License-MIT-yellow

🌟 Live Demo
[Add your live demo link here after deployment]

📋 Table of Contents
Features

Tech Stack

Screenshots

Installation

Configuration

API Documentation

Project Structure

Deployment

Contributing

License

✨ Features
🎯 Core Functionality
Smart Registration System with automatic capacity management

Real-time Waitlisting with position tracking

Instant Updates across all users when registrations occur

Comprehensive Admin Panel for full event management

Email Notifications system (configurable)

👤 User Experience
Browse Events with real-time availability status

One-click Registration with form validation

Waitlist Automation with automatic promotion

Mobile-Responsive design for all devices

Beautiful UI with modern animations and gradients

⚙️ Admin Capabilities
Create & Manage Events with custom capacities

View All Registrations and waitlists in real-time

Cancel Registrations with automatic waitlist promotion

Live Statistics and analytics dashboard

Export Functionality for data management

🛠️ Tech Stack
Frontend
React 18 - Modern UI framework with hooks

React Router DOM - Client-side navigation

Axios - HTTP client for API communication

CSS3 - Advanced styling with variables and animations

Backend
Node.js - Runtime environment

Express.js - Web application framework

MongoDB - NoSQL database for flexible data storage

Mongoose - Elegant MongoDB object modeling

Nodemailer - Email service integration

📸 Screenshots
[Add your screenshots here]

<!-- ![Event List](screenshots/events.png) ![Registration Form](screenshots/registration.png) ![Admin Panel](screenshots/admin.png) -->
🚀 Installation
Prerequisites
Node.js (v14 or higher)

MongoDB (local installation or MongoDB Atlas)

npm or yarn package manager

Step-by-Step Setup
Clone the repository

bash
git clone https://github.com/yourusername/event-registration-system.git
cd event-registration-system
Backend Setup

bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Start the backend server
npm run dev
Frontend Setup (in a new terminal)

bash
cd frontend
npm install
npm start
Access the Application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

MongoDB: http://localhost:27017

⚙️ Configuration
Environment Variables (.env)
Create a .env file in the backend directory:

env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/event-registration
PORT=5000

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Event System <your-email@gmail.com>
Email Setup (Optional)
For Gmail, you'll need to:

Enable 2-factor authentication

Generate an app-specific password

Use the app password in the EMAIL_PASS variable

📚 API Documentation
Events Endpoints
Method	Endpoint	Description
GET	/api/events	Get all active events
GET	/api/events/:id	Get specific event details
POST	/api/events	Create new event (Admin only)
Registration Endpoints
Method	Endpoint	Description
POST	/api/registrations	Register for an event
GET	/api/registrations/event/:eventId	Get event registrations
PUT	/api/registrations/:id/cancel	Cancel registration
🏗️ Project Structure
text
event-registration-system/
├── frontend/                 # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventList.js
│   │   │   ├── EventRegistration.js
│   │   │   ├── AdminPanel.js
│   │   │   └── Navbar.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── backend/                  # Node.js server
│   ├── models/
│   │   ├── Event.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── events.js
│   │   └── registrations.js
│   ├── utils/
│   │   └── emailService.js
│   ├── server.js
│   └── package.json
└── README.md
🎨 Key Components
EventList Component
Displays all available events

Shows real-time capacity status

Responsive grid layout

"Register Now" / "Join Waitlist" buttons

EventRegistration Component
Registration form with validation

Real-time availability checking

Success/error message handling

Auto-redirect after registration

AdminPanel Component
Event creation interface

Registration management

Waitlist viewing and management

Real-time statistics

🔄 Real-time Features
Live Capacity Updates: See available seats change in real-time

Instant Waitlist Management: Automatic promotion when spots open

Admin Panel Sync: Immediate reflection of new registrations

User Feedback: Instant confirmation messages

🚀 Deployment
Frontend Deployment (Netlify/Vercel)
bash
cd frontend
npm run build
# Deploy the 'build' folder to your hosting service
Backend Deployment (Heroku/Railway/DigitalOcean)
Set environment variables in your hosting platform

Deploy the backend folder

Configure MongoDB connection string

MongoDB Setup
Use MongoDB Atlas for cloud database

Or install MongoDB locally for development

🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow React best practices

Use meaningful commit messages

Test your changes thoroughly

Update documentation as needed

🐛 Troubleshooting
Common Issues
MongoDB Connection Error

Ensure MongoDB is running

Check connection string in .env file

Verify database permissions

Email Not Sending

Check email configuration in .env

Verify app passwords for Gmail

Check service provider SMTP settings

Admin Panel Not Updating

Verify backend is running on port 5000

Check browser console for errors

Ensure CORS is properly configured

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
React community for excellent documentation and resources

MongoDB for robust database solutions

Express.js team for the lightweight web framework

All contributors who help improve this project

📞 Support
If you have any questions or need help with setup:

Open an issue

Check the troubleshooting section

Review the API documentation

🌟 Show Your Support
If you find this project helpful, please give it a ⭐️ on GitHub!

Built with ❤️ using React, Node.js, Express, and MongoDB

📊 Project Stats
https://img.shields.io/github/stars/yourusername/event-registration-system?style=social
https://img.shields.io/github/forks/yourusername/event-registration-system?style=social
https://img.shields.io/github/issues/yourusername/event-registration-system
https://img.shields.io/github/issues-pr/yourusername/event-registration-system
