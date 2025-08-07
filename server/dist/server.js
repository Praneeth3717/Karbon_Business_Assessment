"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notesRoutes_1 = __importDefault(require("./routes/notesRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
}
(0, db_1.default)(MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
app.use((0, cors_1.default)({ origin: 'https://karbon-business-assessment.vercel.app', credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/auth', authRoutes_1.default);
app.use('/notes', notesRoutes_1.default);
//# sourceMappingURL=server.js.map