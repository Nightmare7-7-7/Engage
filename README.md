<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&duration=3000&pause=1000&color=6C63FF&center=true&vCenter=true&width=600&lines=Engage+%F0%9F%9A%80;Social+Media+Backend+API;Built+with+TypeScript+%2B+Express" alt="Typing SVG" />

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)


<br/>

> 🌐 A **RESTful API** for a full-featured social media platform — built with TypeScript, Express 5, Prisma ORM & PostgreSQL.

</div>

---

## ✨ Features

<table>
<tr>
<td>

### 👤 User System
- Register & Login with JWT auth
- Secure cookie-based session (18-day expiry)
- Email verification flow
- Forgot/reset password via email OTP
- Update profile info & bio
- Upload & manage profile picture (Cloudinary)
- Follow / Unfollow users
- View followers & following list
- User suggestions
- Search users by username

</td>
<td>

### 📸 Post System
- Create posts with media (image/video) or caption
- Public / Private post visibility
- Edit & delete posts
- Like / Unlike posts (with "liked by you" flag)
- Save / Unsave posts
- View all posts (feed) & single post
- View posts by following
- Full comment system with CRUD
- Nested replies on comments
- Like comments & replies
- Rate limiting on comments & replies (15/hr)

</td>
</tr>
</table>

---

## 🛡️ Security & Infrastructure

| Feature | Details |
|---|---|
| 🔐 Authentication | JWT (HttpOnly Cookie, 18-day session) |
| 🔑 Password Hashing | bcryptjs |
| 🛡️ Helmet | HTTP security headers |
| 🚦 Rate Limiting | Global (400 req/15min) + per-route |
| ✅ Input Validation | Zod schema validators |
| 🌍 CORS | Configured for frontend origins |
| 📧 Email Verification | Required for sensitive actions |
| 🖼️ Media Storage | Cloudinary (profile pics + post media) |
| 🗄️ ORM | Prisma 7 + PostgreSQL via `pg` adapter |

---

## 🗂️ Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # DB models
│   └── migrations/          # Migration history
├── src/
│   ├── configs/
│   │   ├── client.ts        # Prisma client
│   │   └── cloudinary.ts    # Cloudinary config
│   ├── controllers/
│   │   ├── user.controllers.ts
│   │   └── post.controllers.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts     # JWT guard
│   │   ├── verifiedEmail.ts       # Email verification gate
│   │   ├── multer.ts              # File upload handler
│   │   └── multerWrapper.ts
│   ├── routes/
│   │   ├── user.routes.ts
│   │   └── post.routes.ts
│   ├── services/
│   │   ├── user.services.ts       # Business logic
│   │   └── post.services.ts
│   ├── types/
│   │   ├── user.types.ts
│   │   └── post.types.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   ├── error.ts               # Custom error class
│   │   ├── mailer.ts              # Nodemailer setup
│   │   ├── mailContent.ts         # Email templates
│   │   ├── rateLimiter.ts
│   │   └── uploadToCloudinary.ts
│   ├── validators/
│   │   ├── user.validators.ts
│   │   └── post.validators.ts
│   └── server.ts                  # App entry point
├── prisma.config.ts
├── vercel.json
├── tsconfig.json
└── package.json
```

---

## 🗃️ Database Schema

```prisma
User       → posts, followers, following, likes, saves, comments, replies
Post       → likes, comments, saves
Comment    → replies, likes (CmtOrReplyLike)
Reply      → likes (CmtOrReplyLike)
Follow     → follower ↔ following
Like       → liker ↔ post
Save       → saver ↔ post
```

---

## 🚀 API Routes

### 👤 User Routes — `/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register new user |
| `POST` | `/login` | ❌ | Login & get token |
| `POST` | `/upload-profile` | ✅ | Upload profile picture |
| `POST` | `/send-verify-email` | ✅ | Send email verification |
| `GET` | `/verify-email` | ❌ | Verify email token |
| `POST` | `/send-reset-code` | ❌ | Send password reset OTP |
| `POST` | `/verify-reset-code` | ❌ | Verify OTP code |
| `POST` | `/reset-password` | ❌ | Reset password |
| `GET` | `/me` | ✅ | Get own profile |
| `PUT` | `/update-info` | ✅ | Update bio/username etc. |
| `GET` | `/my-posts` | ✅ | Get own posts |
| `GET` | `/follow` | ✅ | Follow / Unfollow user |
| `GET` | `/followers` | ✅ | Get followers list |
| `GET` | `/following` | ✅ | Get following list |
| `GET` | `/search` | ✅ | Search users |
| `GET` | `/suggestions` | ✅ | User suggestions |
| `GET` | `/following-posts` | ✅ | Feed from following |

---

### 📸 Post Routes — `/api/v1/post`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create` | ✅✉️ | Create a new post |
| `GET` | `/get/all` | ✅ | Get all public posts |
| `GET` | `/get` | ✅ | Get post by ID |
| `PUT` | `/update` | ✅✉️ | Update post |
| `DELETE` | `/delete` | ✅✉️ | Delete post |
| `GET` | `/like` | ✅✉️ | Like / Unlike a post |
| `GET` | `/save` | ✅✉️ | Save / Unsave a post |
| `POST` | `/comment/create` | ✅✉️ | Comment on post |
| `GET` | `/comment/get/all` | ✅ | Get all post comments |
| `PUT` | `/comment/update` | ✅✉️ | Edit a comment |
| `DELETE` | `/comment/delete` | ✅✉️ | Delete a comment |
| `GET` | `/comment/like` | ✅✉️ | Like / Unlike comment |
| `POST` | `/comment/reply` | ✅✉️ | Reply to a comment |
| `GET` | `/comment/reply/all` | ✅ | Get comment replies |
| `DELETE` | `/comment/reply/delete` | ✅✉️ | Delete a reply |
| `GET` | `/comment/reply/like` | ✅✉️ | Like / Unlike a reply |

> ✅ = Auth Required &nbsp;&nbsp; ✉️ = Email Verification Required

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database
- Cloudinary account
- Gmail account (for Nodemailer)


### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/engage"
JWT_SECRET="your_jwt_secret"
EMAIL="your_gmail@gmail.com"
PASSWORD="your_app_password"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
PORT=8081
```

### Running the App

```bash
# Generate Prisma client
npx prisma generate

# Push DB schema
npx prisma db push

# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5 |
| Framework | Express 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL (via `pg` adapter) |
| Auth | JWT + HttpOnly Cookies |
| Validation | Zod 4 |
| Media Storage | Cloudinary |
| Email | Nodemailer (Gmail) |
| File Upload | Multer |
| Security | Helmet, CORS, express-rate-limit |
| Dev Tools | Nodemon, tsx |

---

## 🔮 Coming Soon

> These features are actively in development and will be shipped in the next release:

| Feature | Status |
|---|---|
| 🔔 **Live Notifications** | 🚧 In Progress |
| 💬 **Real-time Messaging System** | 🚧 In Progress |

---
