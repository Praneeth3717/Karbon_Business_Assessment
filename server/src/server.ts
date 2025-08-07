import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notesRouter from './routes/notesRoutes';
import authRouter from './routes/authRoutes';
import connectDB from './config/db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined");
  process.exit(1);
}

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

// app.use(cors({ origin: 'https://karbon-business-assessment.vercel.app', credentials: true }));
// Update CORS configuration
app.use(cors({ 
  origin: [
    'https://karbon-business-assessment.vercel.app',
    'https://*.vercel.app'  // Allow all Vercel subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/notes', notesRouter);
