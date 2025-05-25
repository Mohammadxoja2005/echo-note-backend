"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteSchema = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../../schema");
exports.NoteSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    user_id: mongoose_1.Types.ObjectId,
    status: String,
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
    collection: schema_1.Collections.Note,
});
