# API Documentation

## Endpoint: `/api/auth/register`

### Description
This endpoint is used to register a new user. It validates the input data, hashes the password, creates a new user in the database, and returns a JWT token along with the user details.

### Method
`POST`

### Request Body
The request body should be a JSON object with the following fields:
- `fullName`: An object containing:
  - `firstName` (string, required): The first name of the user. Must be at least 3 characters long.
  - `lastName` (string, optional): The last name of the user. Must be at least 3 characters long.
- `email` (string, required): The email address of the user. Must be a valid email format.
- `password` (string, required): The password for the user. Must be at least 6 characters long.

Example:
```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

#### Success
- **Status Code**: `201 Created`
- **Response Body**:
  ```json
  {
    "token": "JWT_TOKEN_HERE",
    "user": {
      "_id": "USER_ID_HERE",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2023-10-01T00:00:00.000Z",
      "updatedAt": "2023-10-01T00:00:00.000Z"
    }
  }
  ```

#### Validation Error
- **Status Code**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "First name must be at least 3 characters",
        "param": "fullName.firstName",
        "location": "body"
      },
      {
        "msg": "Password must be at least 6 characters",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

#### Server Error
- **Status Code**: `500 Internal Server Error`
- **Response Body**:
  ```json
  {
    "message": "Server Error",
    "error": "Error message here"
  }
  ```

### Example Request
```sh
curl -X POST http://localhost:3030/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

## Endpoint: `/api/auth/login`

### Description
This endpoint is used to log in an existing user. It validates the input data, compares the provided password with the stored hashed password, and returns a JWT token along with the user details if the credentials are valid.

### Method
`POST`

### Request Body
The request body should be a JSON object with the following fields:
- `email` (string, required): The email address of the user. Must be a valid email format.
- `password` (string, required): The password for the user. Must be at least 6 characters long.

Example:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

#### Success
- **Status Code**: `201 Created`
- **Response Body**:
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN_HERE",
    "user": {
      "_id": "USER_ID_HERE",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2023-10-01T00:00:00.000Z",
      "updatedAt": "2023-10-01T00:00:00.000Z"
    }
  }
  ```

#### Validation Error
- **Status Code**: `400 Bad Request`
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password must be at least 6 characters",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

#### Invalid Credentials
- **Status Code**: `401 Unauthorized`
- **Response Body**:
  ```json
  {
    "success": false,
    "message": "Invalid Credentials"
  }
  ```

#### Server Error
- **Status Code**: `500 Internal Server Error`
- **Response Body**:
  ```json
  {
    "success": false,
    "message": "Server Error",
    "error": "Error message here"
  }
  ```

### Example Request
```sh
curl -X POST http://localhost:3030/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

## Endpoint: `/api/auth/profile`

### Description
This endpoint is used to get the profile of the currently logged-in user. It requires a valid JWT token to be provided in the request headers or cookies.

### Method
`GET`

### Request Headers
- `Authorization`: Bearer `JWT_TOKEN_HERE` (optional if token is provided in cookies)

### Responses

#### Success
- **Status Code**: `200 OK`
- **Response Body**:
  ```json
  {
    "_id": "USER_ID_HERE",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2023-10-01T00:00:00.000Z",
    "updatedAt": "2023-10-01T00:00:00.000Z"
  }
  ```

#### Unauthorized
- **Status Code**: `401 Unauthorized`
- **Response Body**:
  ```json
  {
    "message": "Unauthorized token: No token provided"
  }
  ```

#### Server Error
- **Status Code**: `500 Internal Server Error`
- **Response Body**:
  ```json
  {
    "message": "Server Error",
    "error": "Error message here"
  }
  ```

### Example Request
```sh
curl -X GET http://localhost:3030/api/auth/profile \
  -H "Authorization: Bearer JWT_TOKEN_HERE"
```

## Endpoint: `/api/auth/logout`

### Description
This endpoint is used to log out the currently logged-in user. It clears the JWT token from cookies and adds the token to a blacklist to prevent further use.

### Method
`GET`

### Responses

#### Success
- **Status Code**: `200 OK`
- **Response Body**:
  ```json
  {
    "message": "logout"
  }
  ```

#### Server Error
- **Status Code**: `500 Internal Server Error`
- **Response Body**:
  ```json
  {
    "message": "Server Error",
    "error": "Error message here"
  }
  ```

### Example Request
```sh
curl -X GET http://localhost:3030/api/auth/logout \
  -H "Authorization: Bearer JWT_TOKEN_HERE"
```