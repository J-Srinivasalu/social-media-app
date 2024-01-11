# Social Media App - Backend

This component is responsible for handling server-side logic and data storage.

## Technologies Used

- **Node.js:** A JavaScript runtime for building scalable network applications.
- **Express:** A fast, unopinionated web framework for Node.js.
- **MongoDB:** A NoSQL database for storing note data.
- **Zod Validation:** A TypeScript-first schema declaration and validation library.

## Getting Started

1. Create a .env file in root

   ```.env
   MONGO_DB_URL="mongodb+srv://<your-username>:<your-password>@<your-cluster-string>.mongodb.net/<your-db-name>"
   PORT=4000
   SECRET_KEY=secretkey
   CLOUDINARY_CLOUD_NAME=cloud_name
   CLOUDINARY_API_KEY=12345678
   CLOUDINARY_SECRET_KEY=yoursecretkey
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Run the development server.

   ```bash
   npm run dev
   ```

4. The backend server will be accessible at `http://localhost:4000`.

## Features Implemented

1. **Register:** User registration with Zod validation for input data.
2. **Login:** Authentication for existing users.
3. **Upload post:** Endpoint for creating and saving posts.
4. **Get Posts:** Endpoint getting posts with filter and limit.
5. **Get Posts by user:** Endpoint getting posts by user with filter and limit.
6. **like Post:** Endpoint to like a post.
7. **Upload comment:** Endpoint for creating and saving commet.
8. **Get comments by post:** Endpoint getting comments for a specific post with filter and limit.
9. **like comment:** Endpoint to like a comment.
10. **Update user:** Endpoint to update user.
11. **get current user details:** Endpoint to get current login user details.
12. **get public user details:** Endpoint to get public profile details of any user on platform.
13. **send friend request:** Endpoint to send friend request.
14. **unfriend request:** Endpoint to send unfriend request.
15. **accept friend request:** Endpoint to accept friend request.
16. **reject friend request:** Endpoint to reject friend request.
17. **start chat:** Endpoint to start chat with a friend.
18. **send message:** Endpoint to send a message in a chat.
19. **get realtime feedback(typing, online, sent, seen):** using socket.io giving feedback to users in realtime.
20. **Refresh token mechanism:** to make app more user friendly.

## Postman Collection Setup

To test the API endpoints using Postman, import the following collection configuration:(not up to date, plannig to add open api/swagger)

### Set the following variables in Postman for easy testing:

```text
   DEV_URL: <DEV_URL>
```

Feel free to reach out if you have any questions or feedback. Happy coding!
