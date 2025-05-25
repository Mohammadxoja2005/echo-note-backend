"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../../schema");
exports.UserSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    picture: String,
    is_active: Boolean,
    oauth: {
        google_id: String,
    },
    subscription: {
        id: { type: String, default: null },
        plan: String,
    },
    remaining_seconds: { type: Number, default: 0 },
    last_visit: { type: Date, default: Date.now },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
    collection: schema_1.Collections.User,
});
