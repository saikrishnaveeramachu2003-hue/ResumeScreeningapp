require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();
const PORT = process.env.PORT || 6002;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const OAUTH_CALLBACK_BASE = process.env.OAUTH_CALLBACK_BASE || `http://localhost:${PORT}`;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_AUTH_ENABLED = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
const GITHUB_AUTH_ENABLED = Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET);

if (!GOOGLE_AUTH_ENABLED) {
  console.warn('WARNING: Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env');
}
if (!GITHUB_AUTH_ENABLED) {
  console.warn('WARNING: GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env');
}

app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

if (GOOGLE_AUTH_ENABLED) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${OAUTH_CALLBACK_BASE}/auth/google/callback`,
    passReqToCallback: false,
  }, (accessToken, refreshToken, profile, done) => {
    done(null, { profile, accessToken });
  }));
}

if (GITHUB_AUTH_ENABLED) {
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${OAUTH_CALLBACK_BASE}/auth/github/callback`,
    scope: ['user:email'],
    passReqToCallback: false,
  }, (accessToken, refreshToken, profile, done) => {
    done(null, { profile, accessToken });
  }));
}

const buildPopupResponse = (provider, user) => {
  const token = jwt.sign({
    provider,
    id: user.profile.id || user.profile.username,
    email: user.profile.emails?.[0]?.value || '',
  }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  });

  const payload = {
    type: 'oauth-success',
    provider,
    token,
    user: {
      id: user.profile.id || user.profile.username,
      displayName: user.profile.displayName || '',
      emails: user.profile.emails || [],
    },
  };

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Authentication Successful</title>
  </head>
  <body>
    <script>
      const data = ${JSON.stringify(payload)};
      const origin = '${CLIENT_ORIGIN}';
      if (window.opener) {
        window.opener.postMessage(data, origin);
        try {
          window.opener.location.href = origin;
        } catch (err) {
          console.warn('Unable to force parent redirect:', err);
        }
      } else {
        window.location.href = origin;
      }
      window.close();
    </script>
    <p>Authentication successful. You can close this window.</p>
  </body>
</html>`;
};

const oauthCallbackHandler = (provider) => (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/failure');
  }
  res.send(buildPopupResponse(provider, req.user));
};

const allowedOrigins = [
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl/postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Simple in-memory OTP store: { email: { code, expiresAt } }
const otpStore = new Map();

// Nodemailer transporter if configured
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const code = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(email, { code, expiresAt });

  const subject = 'Your OTP code';
  const text = `Your OTP code is ${code}. It expires in 5 minutes.`;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: email,
        subject,
        text,
      });
      return res.json({ message: 'OTP sent' });
    } catch (err) {
      console.error('Error sending OTP email:', err);
      return res.status(500).json({ message: 'Failed to send OTP' });
    }
  }

  // If no transporter configured, return the OTP in the response for local testing
  console.log(`OTP for ${email}: ${code}`);
  return res.json({ message: 'OTP sent (dev)', otp: code });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ message: 'No OTP requested for this email' });
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP expired' });
  }
  if (record.code !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  otpStore.delete(email);
  return res.json({ message: 'OTP verified' });
});

const requireGoogleAuth = (req, res, next) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(500).send(`Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env and restart the server.`);
  }
  next();
};

const requireGithubAuth = (req, res, next) => {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return res.status(500).send(`GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend/.env and restart the server.`);
  }
  next();
};

// OAuth routes
app.get('/auth/google', requireGoogleAuth, passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', requireGoogleAuth, passport.authenticate('google', { failureRedirect: '/auth/failure' }), oauthCallbackHandler('google'));
app.get('/auth/github', requireGithubAuth, passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', requireGithubAuth, passport.authenticate('github', { failureRedirect: '/auth/failure' }), oauthCallbackHandler('github'));

app.get('/auth/failure', (req, res) => {
  res.send(`<!doctype html><html><body><p>Authentication failed. Please close this window and try again.</p></body></html>`);
});

app.post('/api/auth/signin', (req, res) => {
  const { username, password } = req.body;
  // In a real app validate against DB
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  // demo user
  const demoUser = { id: 1, username: 'saikrishna', email: 'sai@gmail.com', roles: ['ROLE_USER'] };
  if (username === demoUser.username && password === '123456') {
    const token = jwt.sign({ sub: demoUser.username }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    return res.json({ token, id: demoUser.id, username: demoUser.username, email: demoUser.email, roles: demoUser.roles });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Protected route: Get latest uploads
app.get('/api/dashboard/latest-uploads', verifyToken, (req, res) => {
  // Mock data for recent uploads
  const uploads = [
    { id: 1, filename: 'Resume_John.pdf', uploadedAt: new Date().toISOString(), size: 245000 },
    { id: 2, filename: 'Resume_Jane.pdf', uploadedAt: new Date(Date.now() - 86400000).toISOString(), size: 320000 },
    { id: 3, filename: 'Resume_Bob.pdf', uploadedAt: new Date(Date.now() - 172800000).toISOString(), size: 190000 },
  ];
  res.json(uploads);
});

// Protected route: Get recent jobs
app.get('/api/jobs/recent', verifyToken, (req, res) => {
  // Mock data for recent jobs
  const jobs = [
    { id: 1, title: 'Senior Developer', company: 'Tech Corp', postedAt: new Date().toISOString() },
    { id: 2, title: 'Frontend Engineer', company: 'StartUp Inc', postedAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, title: 'Full Stack Developer', company: 'Big Company', postedAt: new Date(Date.now() - 172800000).toISOString() },
  ];
  res.json(jobs);
});

// Simple JSON-backed user store (avoids adding sqlite/bcrypt deps for now)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Failed to load users.json', err);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save users.json', err);
  }
}

function hashPassword(password) {
  if (!password) return null;
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Signup endpoint: accepts various naming conventions (companyName/company_name/companyname)
app.post('/api/auth/signup', (req, res) => {
  const body = req.body || {};
  console.log('Signup received:', body);
  const username = body.username || body.user || null;
  const email = body.email || null;
  const password = body.password || null;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email and password are required' });
  }

  const company_name = body.company_name || body.companyName || body.companyname || '';
  const hr_name = body.hr_name || body.hrName || body.hrname || '';
  const phone = body.phone || '';
  const website = body.website || '';
  const role = body.role || 'ROLE_HR';

  const users = loadUsers();
  if (users.find(u => u.email === email || u.username === username)) {
    return res.status(409).json({ message: 'User with that email or username already exists' });
  }

  const id = (users.reduce((m, u) => Math.max(m, u.id || 0), 0) || 0) + 1;
  const hashed = hashPassword(password);

  const newUser = {
    id,
    email,
    username,
    password: hashed,
    role,
    company_name,
    hr_name,
    phone,
    website,
    email_verified: false,
    otp_code: null,
    login_otp: null,
  };

  users.push(newUser);
  saveUsers(users);

  const safeUser = { ...newUser };
  delete safeUser.password;
  return res.status(201).json({ message: 'User created', user: safeUser });
});

app.listen(PORT, () => {
  console.log(`Auth backend listening on http://localhost:${PORT}`);
  if (!transporter) console.log('No SMTP configured — OTPs will appear in server logs and responses');
});
