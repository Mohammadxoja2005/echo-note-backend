"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const guard_1 = require("../../guard");
const get_all_1 = require("../../../usecases/note/get-all");
const get_1 = require("../../../usecases/note/get");
const update_title_and_description_1 = require("../../../usecases/note/update-title-and-description");
const jsonwebtoken_1 = require("jsonwebtoken");
let NoteController = class NoteController {
    constructor(noteGetAllUseCase, noteGetUseCase, noteUpdateTitleAndDescription) {
        this.noteGetAllUseCase = noteGetAllUseCase;
        this.noteGetUseCase = noteGetUseCase;
        this.noteUpdateTitleAndDescription = noteUpdateTitleAndDescription;
    }
    getAll(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { userId, email, name } = (0, jsonwebtoken_1.decode)(request.header("Token"));
            const { pageNumber } = request.params;
            const { notes, totalPages } = yield this.noteGetAllUseCase.execute(userId, parseInt(pageNumber));
            response.status(200).json({ notes: notes, totalPages: totalPages });
        });
    }
    get(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { userId, email, name } = (0, jsonwebtoken_1.decode)(request.header("Token"));
            const { noteId } = request.params;
            const note = yield this.noteGetUseCase.execute(noteId, userId);
            response.status(200).json({ note: note });
        });
    }
    update(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { userId, email, name } = (0, jsonwebtoken_1.decode)(request.header("Token"));
            const { noteId } = request.params;
            const { title, description } = request.body;
            yield this.noteUpdateTitleAndDescription.execute(noteId, userId, title, description);
            response.status(200).json({ status: "success" });
        });
    }
};
exports.NoteController = NoteController;
tslib_1.__decorate([
    (0, common_1.Get)("get-all/:pageNumber"),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NoteController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, common_1.Post)("get/:noteId"),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NoteController.prototype, "get", null);
tslib_1.__decorate([
    (0, common_1.Post)("update/:noteId"),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NoteController.prototype, "update", null);
exports.NoteController = NoteController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guard_1.AuthGuard),
    (0, common_1.Controller)("note"),
    tslib_1.__metadata("design:paramtypes", [get_all_1.NoteGetAllUseCase,
        get_1.NoteGetUseCase,
        update_title_and_description_1.NoteUpdateTitleAndDescription])
], NoteController);
