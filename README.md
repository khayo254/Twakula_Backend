# Twakula - Recipe Sharing Platform

Twakula is a backend API for a recipe sharing platform where users can share recipes, rate them, and retrieve shared recipes. It is designed to be similar to an "Instagram of recipes," allowing users to discover and interact with culinary creations.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Third-Party Services](#third-party-services)
7. [Work Schedule](#work-schedule)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- **User Authentication**: Secure user registration and login with JWT.
- **Recipe Sharing**: Users can create, update, and delete recipes.
- **Recipe Retrieval**: Users can browse and search for recipes.
- **Rating and Reviews**: Users can rate and review recipes.
- **Image Uploads**: Recipes can include images, stored using AWS S3 or Cloudinary.
- **Data Validation and Error Handling**: Ensures data integrity and provides meaningful error messages.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Storage**: AWS S3 or Cloudinary (for images)
- **Other Tools**: Mongoose, bcrypt, dotenv

## Setup Instructions

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/khayo254/Twakula_Backend.git
   cd Twakula_Backend
   ```

2. **Install Dependencies:**
   ```sh
   npm install
   ```

3. **Environment Variables:**
   - Create a `.env` file in the root directory and add the following variables:
     ```env
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/twakula
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

4. **Run the Server:**
   ```sh
   npm start
   ```

5. **API Documentation:**
   - Access the API documentation at `http://localhost:3000/api-docs` (if using Swagger or similar tool).

## API Endpoints

### **Authentication**
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`

### **Users**
- **Get User Profile**: `GET /api/users/:id`
- **Update User Profile**: `PUT /api/users/:id`

### **Recipes**
- **Create Recipe**: `POST /api/recipes`
- **Get All Recipes**: `GET /api/recipes`
- **Get Recipe by ID**: `GET /api/recipes/:id`
- **Update Recipe**: `PUT /api/recipes/:id`
- **Delete Recipe**: `DELETE /api/recipes/:id`

### **Ratings**
- **Rate a Recipe**: `POST /api/recipes/:id/rate`
- **Get Ratings for a Recipe**: `GET /api/recipes/:id/ratings`

## Database Schema

### **Users Collection**
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "password": "String",
  "roles": ["String"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### **Recipes Collection**
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "ingredients": ["String"],
  "steps": ["String"],
  "images": ["String"],
  "authorId": "ObjectId",
  "ratings": [
    {
      "userId": "ObjectId",
      "rating": "Number",
      "review": "String"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### **Ratings Collection**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "recipeId": "ObjectId",
  "rating": "Number",
  "review": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### **Sessions Collection (Optional)**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "token": "String",
  "createdAt": "Date"
}
```

## Third-Party Services

### **AWS S3**
- **Purpose**: Storing and serving recipe images.
- **Features**: Scalable storage, high durability and availability, fine-grained access control, and data encryption.


## Contributing

1. **Fork the Repository**
2. **Create a Feature Branch:**
   ```sh
   git checkout -b feature-branch-name
   ```
3. **Commit Your Changes:**
   ```sh
   git commit -m 'Add some feature'
   ```
4. **Push to the Branch:**
   ```sh
   git push origin feature-branch-name
   ```
5. **Open a Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
