"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.get('/google/login', authController_1.googleLogin);
router.get('/google/callback', authController_1.googleCallback);
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map