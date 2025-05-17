# AI Bug Tracker

This is a full-stack bug tracking system that uses AI to assist in identifying duplicate bug reports, classifying bug types, checking severity levels, and determining if a bug is functional or not.

Users can report a bug using a simple form. The system then analyzes the input using an AI model that compares it with existing reports stored in the database. It also labels each bug with type and severity, which can be helpful for prioritization and triage.

The project consists of three main parts:

- Frontend built with React and Tailwind CSS
- Backend API using Node.js and Express.js
- AI service using FastAPI and Python for NLP-based classification

MongoDB is used as the database to store bug reports and their associated AI results.

To run the project, each part (frontend, backend, AI) needs to be started separately. After submitting a bug, the AI automatically analyzes it and displays the results in the interface.

This tool helps reduce manual effort in bug management and improves overall tracking efficiency.

