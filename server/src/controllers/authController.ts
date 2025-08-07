import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';
import { BACKEND_URL, FRONTEND_URL } from '../utils/urls';

const generateToken = (userId: string, name: string) => {
  return jwt.sign({ userId, name }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export interface AuthRequest extends Request {
  userId?: string;
  name?: string;
}

export const verifyUser = (req: AuthRequest, res: Response) => {
  res.status(200).json({
    userId: req.userId,
    name: req.name,
  });
};


export const googleLogin = (_req: Request, res: Response) => {
  const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${BACKEND_URL}/auth/google/callback&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;
  res.redirect(redirectUri);
}

export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BACKEND_URL}/auth/google/callback`,
        grant_type: 'authorization_code',
      },
    });

    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    const { sub, name, email} = userInfo.data;
    let user = await User.findOne({ email });

    if (user && !user.googleId) {
      return res.status(400).send("Email registered manually. Use password login.");
    }

    if (!user) {
      user = await User.create({ googleId: sub, name, email});
    }

    const token = generateToken((user._id as string), user.name);

    if(token){
      return res.status(400).send("token found :")
    }

    res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none', 
  });

    res.redirect(`${FRONTEND_URL}/home`);
  } catch (err: any) {
    console.error('OAuth Error:', err.message);
    res.status(500).send('Authentication failed');
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password') as IUser;
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid or Google account' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken((user._id as string), user.name);
    res.cookie('token', token,{
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });


    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};


export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      if (!existing.password) {
        return res.status(400).json({ message: 'Registered with Google. Use Google login.' });
      }
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });
    res.status(201).json({ message: 'Registered successfully. Please login.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};


