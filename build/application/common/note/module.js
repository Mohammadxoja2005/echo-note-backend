"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("../mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const schema_1 = require("../../../infrastructure/schema");
const schema_2 = require("../../../infrastructure/mongodb/note/schema");
const common_2 = require("../../../common");
const note_impl_1 = require("../../../infrastructure/mongodb/note/note.impl");
const get_all_1 = require("../../usecases/note/get-all");
const get_1 = require("../../usecases/note/get");
const update_title_and_description_1 = require("../../usecases/note/update-title-and-description");
const note_1 = require("../../api/controller/note");
let NoteModule = class NoteModule {
};
exports.NoteModule = NoteModule;
exports.NoteModule = NoteModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule,
            mongoose_2.MongooseModule.forFeature([
                {
                    name: schema_1.Collections.Note,
                    schema: schema_2.NoteSchema,
                },
            ]),
        ],
        providers: [
            {
                provide: common_2.Infrastructure.Repository.Note,
                useClass: note_impl_1.NoteRepositoryImpl,
            },
            get_all_1.NoteGetAllUseCase,
            get_1.NoteGetUseCase,
            update_title_and_description_1.NoteUpdateTitleAndDescription
        ],
        controllers: [note_1.NoteController],
        exports: [common_2.Infrastructure.Repository.Note],
    })
], NoteModule);
