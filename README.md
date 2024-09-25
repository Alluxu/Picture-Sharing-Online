# IMAGE SHARE JS
## Overview
IMAGE SHARE JS is a full-featured image-sharing web application that allows users to upload, share, and manage their images. It provides a secure platform where users can register, log in, and maintain their profiles with both public and private images. The application includes powerful features for managing images, user comments, and tags, while also giving owners full control over their uploads.

The app is fully orchestrated and deployed using Docker Swarm, with continuous integration and deployment managed by GitHub Actions. The integrity and security of the web application are automated using open-source security tools.

## Features

User Profiles
User Registration & Login: Users can register, log in, and access their own profile.
Private Profile: Each user has a private profile where they can manage their images.
Profile Management: Users can upload images, set them as public or private, and add/edit tags.

Image Management
Upload Images: Users can upload images directly from their devices.
Private/Public Images: Users can choose to keep images private or share them publicly.
Tagging: Add custom tags to organize images. Tags can be edited by the image owner.
Commenting: Users can comment on publicly shared images.
Download/Delete: Image owners can download or delete their own images.
Image Visibility Toggle: Users can switch the visibility of their images between public and private.

Security & Automation
CI/CD Pipeline: The project uses GitHub Actions for automated builds, testing, and deployment.
Security: The integrity of the web application is tested using open-source security tools.
Docker Swarm: The entire web application, including the backend, frontend, and database, is containerized and deployed using Docker Swarm for scalability and ease of orchestration.

Technology Stack
Frontend: Next.js, Tailwind CSS
Backend: Node.js, MySQL
Database: MySQL
Authentication: Cookie-based authentication for user sessions
DevOps: Docker, Docker Swarm, GitHub Actions
Testing & Security: Open-source security tools (e.g., OWASP ZAP, Trivy) integrated into the CI/CD pipeline

## Installation & Deployment
### Clone the repository:
`git clone https://github.com/your-repo/image-share-js.git`

Environment Setup: Set up the .env file with your environment variables (MySQL credentials, etc.).

Docker Swarm Deployment: Deploy the application using Docker Swarm:
`docker stack deploy -c docker-compose.yml image-share`
Access the Application: Open your browser and navigate to http://localhost:3000.



## Contribution Guidelines
Fork the repository.
Create a feature branch.
Commit your changes.
Open a pull request.

## License
This project is licensed under the MIT License.
