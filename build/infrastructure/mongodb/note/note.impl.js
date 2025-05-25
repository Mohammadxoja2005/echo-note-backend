"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteRepositoryImpl = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schema_1 = require("../../schema");
const mongoose_2 = require("mongoose");
const types_1 = require("../../../domain/note/types");
let NoteRepositoryImpl = class NoteRepositoryImpl {
    constructor(model) {
        this.model = model;
    }
    create(note) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const document = yield this.model.create({
                title: note.title,
                description: note.description,
                user_id: new mongoose_2.Types.ObjectId(note.userId),
                status: note.status,
            });
            return this.documentToEntity(document);
        });
    }
    getById(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const document = yield this.model.findOne({
                _id: id,
                user_id: userId,
            });
            if (!document) {
                throw new Error("Note not found");
            }
            return this.documentToEntity(document);
        });
    }
    getAll(userId_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (userId, page = 1) {
            const limit = 10;
            const skip = (page - 1) * limit;
            const [documents, totalCount] = yield Promise.all([
                this.model
                    .find({
                    user_id: new mongoose_2.Types.ObjectId(userId),
                })
                    .sort({ created_at: -1 })
                    .skip(skip)
                    .limit(limit),
                this.model.countDocuments({
                    user_id: new mongoose_2.Types.ObjectId(userId),
                }),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                notes: documents.map((doc) => this.documentToEntity(doc)),
                totalPages,
            };
        });
    }
    updateTitleAndDescription(id, userId, title, description) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({
                _id: new mongoose_2.Types.ObjectId(id),
                user_id: new mongoose_2.Types.ObjectId(userId),
            }, { title: title, description: description, status: types_1.NoteStatus.done });
        });
    }
    documentToEntity(document) {
        return {
            id: document._id.toString(),
            title: document.title,
            description: document.description,
            userId: document.user_id.toString(),
            status: document.status,
            createdAt: document.created_at,
            updatedAt: document.updated_at,
        };
    }
};
exports.NoteRepositoryImpl = NoteRepositoryImpl;
exports.NoteRepositoryImpl = NoteRepositoryImpl = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(schema_1.Collections.Note)),
    tslib_1.__metadata("design:paramtypes", [mongoose_2.Model])
], NoteRepositoryImpl);
