"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteUpdateTitleAndDescription = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
let NoteUpdateTitleAndDescription = class NoteUpdateTitleAndDescription {
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    execute(id, userId, title, description) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.noteRepository.updateTitleAndDescription(id, userId, title, description);
        });
    }
};
exports.NoteUpdateTitleAndDescription = NoteUpdateTitleAndDescription;
exports.NoteUpdateTitleAndDescription = NoteUpdateTitleAndDescription = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.Repository.Note)),
    tslib_1.__metadata("design:paramtypes", [Object])
], NoteUpdateTitleAndDescription);
