"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.googleCallback = exports.googleLogin = exports.verifyUser = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const urls_1 = require("../utils/urls");
const generateToken = (userId, name) => {
    return jsonwebtoken_1.default.sign({ userId, name }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
const verifyUser = (req, res) => {
    res.status(200).json({
        userId: req.userId,
        name: req.name,
    });
};
exports.verifyUser = verifyUser;
const googleLogin = (_req, res) => {
    // const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:5000/auth/google/callback&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;
    const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${urls_1.BACKEND_URL}/auth/google/callback&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;
    res.redirect(redirectUri);
};
exports.googleLogin = googleLogin;
const googleCallback = async (req, res) => {
    const code = req.query.code;
    try {
        const { data } = await axios_1.default.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                // redirect_uri: 'http://localhost:5000/auth/google/callback',
                redirect_uri: `${urls_1.BACKEND_URL}/auth/google/callback`,
                grant_type: 'authorization_code',
            },
        });
        const userInfo = await axios_1.default.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const { sub, name, email } = userInfo.data;
        let user = await User_1.default.findOne({ email });
        if (user && !user.googleId) {
            return res.status(400).send("Email registered manually. Use password login.");
        }
        if (!user) {
            user = await User_1.default.create({ googleId: sub, name, email });
        }
        const token = generateToken(user._id, user.name);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none', // important for cross-domain cookies
        });
        // res.cookie('token',token)
        // res.redirect('http://localhost:5173/home');
        res.redirect(`${urls_1.FRONTEND_URL}/home`);
    }
    catch (err) {
        console.error('OAuth Error:', err.message);
        res.status(500).send('Authentication failed');
    }
};
exports.googleCallback = googleCallback;
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            if (!existing.password) {
                return res.status(400).json({ message: 'Registered with Google. Use Google login.' });
            }
            return res.status(400).json({ message: 'User already exists.' });
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        await User_1.default.create({ name, email, password: hashed });
        res.status(201).json({ message: 'Registered successfully. Please login.' });
    }
    catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid or Google account' });
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = generateToken(user._id, user.name);
        // res.cookie('token',token)
        res.cookie('token', token);
        res.status(200).json({ message: 'Login successful' });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login failed' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map