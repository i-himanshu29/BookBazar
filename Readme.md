
# 📚 BookBazar – A Scalable Backend for an Online Bookstore

BookBazar is a feature-rich backend API built to power a modern online bookstore. Designed with scalability and modularity in mind, this project replicates a real-world e-commerce backend system where users can register, browse books, manage their cart, place orders, and leave reviews.

The system incorporates robust authentication, role-based authorization, secure payment simulation, image uploads to Cloudinary, and a clean MVC folder structure — making it a great showcase of best practices in backend development with Node.js, Express, and MongoDB.

Whether you're a developer exploring backend architecture or building your own e-commerce solution, BookBazar offers a solid foundation with production-ready patterns.




## Badges

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/) 
[![Node.js](https://img.shields.io/badge/Node.js-849931?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![JWT Auth](https://img.shields.io/badge/JWT-Auth-orange?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-green)](https://nodemailer.com/about/)
[![Mailgen](https://img.shields.io/badge/Mailgen-Dynamic--Emails-orange)](https://www.npmjs.com/package/mailgen)
[![Env Variables](https://img.shields.io/badge/.env-Environment%20Variables-blue)](https://www.npmjs.com/package/dotenv)

## Tech Stack

**Server:** Node, Express , MongoDB and Mongoose


## Features

- Working Backend with full CRUD for books , review , order
- JWT-based user authentication
- API Key generation to access product and order routes
- Middleware for authentication and key verification
- Full Postman collection with testable endpoints and examples
- Razorpay Payment integration


### Tables to created
- users
- api_keys
- books
- reviews
- orders
- address
- cart_items
- payment

### Security
- JWT Auth required for reviews and orders
- Admin check middleware for book creation/deletion
- API key middleware for accessing /books, /oders , /payments


### Deliverables checklist
- Auth + API key (jwt , key generation)
- Book CRUD with admin check
- Reviews & Orders functionality
- Middleware (JWT , API Key , Admin)
- DB structure & relationships
- Postman collection
- Razorpay , cart, email features 
## API Reference

### HealthCheck Route
```http
  GET /api/v1/healthcheck/
```

### Authentication Routes
#### Register User
```http
  POST /api/v1/users/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | *Required*. The name of the user |
| `email` | `string` | *Required*. The name of the email |
| `password` | `string` | *Required*. The name of the password |
| `role` | `string` | *Required*. The name of the role |

#### Verify User
```http
  GET /api/v1/users/verify/:token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | *Required*. The email verification token |

#### login User
```http
  POST /api/v1/users/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | *Required*. The name of the email |
| `password` | `string` | *Required*. The name of the password |

#### Resend Mail
```http
  GET /api/v1/users/resend-mail
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | *Required*. User's email address |

#### Refresh Token
```http
  POST /api/v1/users/refresh-token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `refreshToken`      | `string` | *Required*. The refresh token issued during login |

#### Forgot password
```http
  POST /api/v1/users/forgot-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | *Required*. User's email address |

#### Change password
```http
  POST /api/v1/users/change-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `oldPassword`      | `string` | *Required*. Old Password is required |
| `newPassword`      | `string` | *Required*. New Password is required |

#### Profile
```http
  GET /api/v1/users/profile
```

#### Logout
```http
  POST /api/v1/users/logout
```


### Book Routes
#### Add Book
```http
  POST /api/v1/book/add-book
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`       | `string` | *Required*. Title of the book                    |
| `description` | `string` | *Required*. Short description about the book     |
| `author`      | `string` | *Required*. Author of the book                   |
| `price`       | `number` | *Required*. Price of the book                    |
| `stock`       | `number` | *Required*. Quantity available in stock          |
| `image`       | `file`   | *Required*. Cover image of the book (form-data)  |


#### Get All Book
```http
  GET /api/v1/book/
```

#### GetBookById
```http
  GET /api/v1/book/:bookId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. Id of book |


#### Update Book
```http
  PATCH /api/v1/book/:bookId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `bookId`      | `string` | *Required*. The ID of the book to be updated     |

| Parameter     | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| `title`       | `string` | *Optional*. Updated title of the book            |
| `description` | `string` | *Optional*. Updated description about the book   |
| `author`      | `string` | *Optional*. Updated author name                  |
| `price`       | `number` | *Optional*. Updated price of the book            |
| `stock`       | `number` | *Optional*. Updated stock quantity               |
| `image`       | `file`   | *Optional*. Updated cover image (form-data)      |


#### Delete Book
```http
  DELETE /api/v1/book/:bookId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. bookId is required |


### Cart Routes
#### Add to cart
```http
  POST /api/v1/cart/add/:bookId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `bookId`      | `string` | *Required. ID of the book to add to cart |
| `quantity`      | `number` | Optional. Quantity of the book (default: 1) |

#### Get Cart Item
```http
  GET /api/v1/cart/
```

#### Remove From cart
```http
  DELETE /api/v1/cart/remove/:cartItemId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. cart id is required |


### Order Routes
#### create Order
```http
  POST /api/v1/order/create
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `items`      | `array` | *Required*. Items to include in order |
| `shippingAddress`| `Object` | *Required*. Address to ship the order |
| `paymentMethod`| `string` | *Required*. Payment method used|

#### get Users Order
```http
  GET /api/v1/order/user
```

#### Get Order By Id
```http
  GET /api/v1/order/:orderId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. Id of order |

#### Get All Orders
```http
  GET /api/v1/order/
```

#### Get Order Status
```http
  GET /api/v1/order/status/:orderId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. Id of order |

#### Update order Status
```http
  PATCH /api/v1/order/status/:orderId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. Id of item to fetch |
| `status`      | `string` | *Required*. The name of the status |

#### Cancel Order
```http
  PATCH /api/v1/order/cancel/:orderId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. Id of order |


### Review Routes
#### add Review
```http
  POST /api/v1/review/add-review/:bookId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. Id of book |
| `rating`      | `number` | *Required*. rating number  |
| `comment`      | `string` | *Required*. comment  |

#### get Book Review
```http
  GET /api/v1/review/:bookId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. Id of book |


#### Delete Review
```http
  DELETE /api/v1/review/:reviewId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. Id of review |


### Address Routes
#### add Address
```http
  POST /api/v1/address/add-address
```

| Parameter     | Type      | Description                                      |
|---------------|-----------|--------------------------------------------------|
| `fullName`    | `string`  | *Required*. Full name of the recipient         |
| `street`      | `string`  | *Required*. Street address                     |
| `city`        | `string`  | *Required*. City of the recipient              |
| `state`       | `string`  | *Required*. State of the recipient             |
| `country`     | `string`  | *Required*. Country of the recipient           |
| `postalCode`  | `string`  | *Required*. Postal/ZIP code                    |
| `phone`       | `string`  | *Required*. Contact number                     |
| `isDefault`   | `boolean` | *Optional*. Whether this is the default address  |

#### get Address
```http
  GET /api/v1/address/
```


#### update Address
```http
  PATCH /api/v1/address/:addressId
```

| Parameter     | Type      | Description|
|---------------|-----------|--------------------------------------------------|
| `id`      | `string` | *Required*. Id of address |
| `addressId`   | `string`  | *Required*. Unique ID of the address to update |
| `fullName`    | `string`  | *Optional*. Updated full name of the recipient   |
| `street`      | `string`  | *Optional*. Updated street address               |
| `city`        | `string`  | *Optional*. Updated city                         |
| `state`       | `string`  | *Optional*. Updated state                        |
| `country`     | `string`  | *Optional*. Updated country                      |
| `postalCode`  | `string`  | *Optional*. Updated postal or ZIP code           |
| `phone`       | `string`  | *Optional*. Updated phone number                 |
| `isDefault`   | `boolean` | *Optional*. Set as default address               |



#### delete Address
```http
  DELETE /api/v1/address/remove/:addressId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | *Required*. Id of address|


### Admin Routes
#### get Site Status
```http
  GET /api/v1/admin/site-status
```

#### get Top SellingBooks
```http
  GET /api/v1/admin/top-book
```

#### get top users
```http
  GET /api/v1/admin/top-users
```

#### get Daily Orders
```http
  GET /api/v1/admin/daily-orders
```

#### get revenue reports
```http
  GET /api/v1/admin/revenue
```

### Payment Routes
#### initiate Payment
```http
  POST /api/v1/payment/initiate
```
| Parameter              | Type     | Description                                                |
|------------------------|----------|------------------------------------------------------------|
| `amount`               | `number` | **Required**. Total payment amount in smallest currency unit (e.g., paise) |
| `orderId`              | `string` | **Required**. ID of the order this payment is for          |
| `method`               | `string` | **Required**. Payment method used (e.g., `"razorpay"`)     |
| `providerReferenceId`  | `string` | **Required**. Unique reference string from payment provider |

#### verify Payment
```http
  POST /api/v1/payment/verify
```

#### get user Payment
```http
  GET /api/v1/payment/user
```

#### get All Payment
```http
  GET /api/v1/payment/get-all-payment
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`MONGO_URI`

`BASE_URL`

`CORS_ORIGIN`

`ACCESS_TOKEN_SECRET`

`ACCESS_TOKEN_EXPIRY`

`REFRESH_TOKEN_SECRET`

`REFRESH_TOKEN_EXPIRY`

`JWT_SECRET`

`MAILTRAP_SMTP_HOST`

`MAILTRAP_SMTP_PORT`

`MAILTRAP_SMTP_USER`

`MAILTRAP_SMTP_PASS`

`MAILTRAP_SENDERMAIL`

`NODE_ENV`

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`

`RAZORPAY_KEY_ID`

`RAZORPAY_KEY_SECRET`
## Installation

Install my-project with npm

```bash
  npm install 
```
```bash
  npm install express
```
```bash
  npm i dotenv
```
```bash
  npm i express-validator
```
```bash
  npm i bcryptjs
```
```bash
  npm i crypto
```
```bash
  npm i cookie-parser
```
```bash
  npm i jsonwebtoken
```
```bash
  npm i mongoose 
```
```bash
  npm i cors 
```
```bash
  npm i mailgen
```
```bash
  npm i nodemailer
```
```bash
  npm i multer
```
```bash
  npm i cloudinary
```
```bash
  npm i cloudinary-build-url
```
```bash
  npm i razorpay
```
```bash
  npm i -D nodemon
```
```bash
  npm i -D prettier
```


## Running Tests

To run tests, run the following command

```bash
  npm run start
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/i-himanshu29/BookBazar.git
```

Go to the project directory

```bash
  cd BookBazar
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

### 📁 Project Structure - BookBazar

```
BookBazar/
├── src/
│   ├── config/
│   │   ├── cloudinary.config.js
│   │   ├── dbconnect.config.js
│   │   
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── book.controller.js
│   │   ├── order.controller.js
│   │   ├── cart.controller.js
│   │   ├── review.controller.js
│   │   └── address.controller.js
│   │   └── adminDashboard.controller.js
│   │   └── apiKey.controller.js
│   │   └── payment.controller.js
│   │   └── healthcheck.controller.js
│
│   ├── middlewares/
│   │   ├── auth.middleware.js        # verifyJWT, checkAdmin
│   │   ├── upload.middleware.js      # multer config
│   │   ├── validator.middleware.js
│
│   ├── models/
│   │   ├── user.model.js
│   │   ├── book.model.js
│   │   ├── cart.model.js
│   │   ├── order.model.js
│   │   ├── review.model.js
│   │   └── address.model.js
│   │   └── apiKey.model.js
│   │   └── payment.model.js
│
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── book.routes.js
│   │   ├── order.routes.js
│   │   ├── cart.routes.js
│   │   ├── review.routes.js
│   │   └── address.routes.js
│   │   └── admin.routes.js
│   │   └── payment.routes.js
│   │   └── healthcheck.routes.js
│
│   ├── utils/
│   │   ├── async-handler.util.js
│   │   ├── api-error.util.js
│   │   └── api-response.util.js
│   │   └── mal.util.js
│
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── book.validator.js
│   │   ├── order.validator.js
│   │   ├── cart.validator.js
│   │   ├── review.validator.js
│   │   └── address.validator.js
│   │   └── payment.validator.js
│
│   ├── app.js       # Express app setup (middlewares, routes)
│   └── server.js    # Entry point (connect DB and start server)
│
├── public/          # for local image storage before upload
├── .env
├── .gitignore
├── package.json
└── README.md
└── .prettierrc
└── .prettierignore
```

# Hi, I'm Himanshu Maurya! 👋


## 🚀 About Me
Hello, I'm Himanshu Maurya, a passionate Software Developer who loves building innovative and efficient software.


## 🛠 Skills
JavaScript , React.js , Tailwindcss , Next.js , Node.js , Express.js , MongoDB , PostgreSql , Redis , Kafka , Deployment , Docker , WebSocket , Testing , Git/GitHub , AWS , etc.


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://www.himanshumaurya.in/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ihimanshu29/)

[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/ihimanshu29)


## Acknowledgements

- Thanks to [Hitesh Choudhary](https://x.com/Hiteshdotcom) and [Piyush Garg](https://x.com/piyushgarg_dev) sir for the inspiration and guidance for his in-depth backend knowledge and support.
