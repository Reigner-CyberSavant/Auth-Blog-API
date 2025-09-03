Auth-Blog-API

A production-ready RESTful API that combines user authentication, blog management, file uploads, and centralized error handling.
Designed with scalability, maintainability, and clean code architecture in mind.




✨ Key Features

🔐 Authentication & Authorization

JWT-based authentication flow

Secure password hashing with bcrypt

Role-based access control ready




📝 Blog API

CRUD operations for blog posts

User-specific blog ownership

Extendable model structure for scalability




📂 File Uploads

Image/file uploads with Multer

Organized storage under /uploads

Easy integration with cloud storage (AWS S3, Cloudinary)




⚡ Error Handling

Centralized global error handler

Structured error response format

Developer-friendly stack traces in development mode




🛡 Security

Environment variables via dotenv

CORS enabled for controlled API access

Helmet middleware for HTTP header hardening




🛠 Tech Stack

Node.js + Express.js (backend framework)

MongoDB + Mongoose (database & ODM)

JWT + bcrypt (authentication & security)

Multer (file uploads)

Nodemon (development server)



📌 API Endpoints


🔑 Authentication

POST /api/auth/register → Register a new user

POST /api/auth/login → Login and receive JWT




📝 Blog Management

POST /api/posts → Create a blog post (auth required)

GET /api/posts → Get all posts

GET /api/posts/:id → Get post by ID

PUT /api/posts/:id → Update post (auth required)

DELETE /api/posts/:id → Delete post (auth required)




📂 File Upload

POST /api/pix-upload/upload → Upload file (field: file)

📸 File Upload Example (Postman)

Method: POST

URL: http://localhost:3000/api/upload

Body: form-data

Key: file (type: File)

Value: Select file from your system



📜 License

This project is licensed under the MIT License.

⚡ Why this project matters:

This API demonstrates real-world backend development practices: modular architecture, secure authentication, structured error handling, and extensibility for production use.