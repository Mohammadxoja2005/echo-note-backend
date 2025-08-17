"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
let MongooseModule = class MongooseModule {
};
exports.MongooseModule = MongooseModule;
exports.MongooseModule = MongooseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot("mongodb+srv://echonote:Muha2005@cluster0.rmixi.mongodb.net/echo_note?retryWrites=true&w=majority&appName=Cluster0"),
        ],
    })
], MongooseModule);
