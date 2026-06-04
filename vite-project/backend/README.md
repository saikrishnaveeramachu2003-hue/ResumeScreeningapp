Local backend for OTP + signin (development only)

Setup
1. Open a terminal and install dependencies:

```bash
cd backend
npm install
```

2. Configure environment variables (optional for sending real emails). Create a `.env` file in `backend/` with:

```
PORT=6002
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=no-reply@yourdomain.com
```

If you don't configure SMTP, OTP codes will be printed to the server console and returned in the `send-otp` response (useful for local testing).

Run
```bash
npm run dev
```

Endpoints
- `POST /api/auth/send-otp` { email }
- `POST /api/auth/verify-otp` { email, otp }
- `POST /api/auth/signin` { username, password }

Notes
- This is a minimal development server. Do not use in production.
