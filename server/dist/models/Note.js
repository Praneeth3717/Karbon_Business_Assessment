"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./User"));
const noteSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: User_1.default, required: true, },
    title: { type: String, required: true, },
    description: { type: String, required: true, },
    type: { type: String, enum: ["personal", "home", "business"], required: true, },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Note", noteSchema);
//# sourceMappingURL=Note.js.map