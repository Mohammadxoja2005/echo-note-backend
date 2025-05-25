"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteGetUseCase = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
let NoteGetUseCase = class NoteGetUseCase {
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    execute(noteId, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.noteRepository.getById(noteId, userId);
        });
    }
};
exports.NoteGetUseCase = NoteGetUseCase;
exports.NoteGetUseCase = NoteGetUseCase = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.Repository.Note)),
    tslib_1.__metadata("design:paramtypes", [Object])
], NoteGetUseCase);
