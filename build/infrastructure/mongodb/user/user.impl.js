"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const schema_1 = require("../../schema");
const mongoose_2 = require("@nestjs/mongoose");
let UserRepositoryImpl = class UserRepositoryImpl {
    constructor(model) {
        this.model = model;
    }
    create(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isUserExists = yield this.model.findOne({
                "oauth.google_id": user.oauth.googleId,
            });
            const isEmailUserExists = yield this.model.findOne({
                email: user.email,
            });
            if (isUserExists || isEmailUserExists) {
                return;
            }
            yield this.model.create({
                name: user.name,
                email: user.email,
                is_active: user.isActive,
                picture: user.picture,
                oauth: {
                    google_id: user.oauth.googleId,
                },
                remaining_seconds: user.remainingSeconds,
                last_visit: user.lastVisit,
                subscription: {
                    id: null,
                    plan: user.subscription.plan,
                },
            });
        });
    }
    getByGoogleId(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const document = yield this.model.findOne({ "oauth.google_id": id });
            if (!document) {
                throw new common_1.NotFoundException("User not found");
            }
            return this.documentToEntity(document);
        });
    }
    getById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const document = yield this.model.findOne({ _id: new mongoose_1.Types.ObjectId(id) });
            if (!document) {
                throw new Error("User not found");
            }
            return this.documentToEntity(document);
        });
    }
    updateStatus(userId, status) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ _id: new mongoose_1.Types.ObjectId(userId) }, {
                is_active: status.active,
            });
        });
    }
    updatePlan(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ _id: new mongoose_1.Types.ObjectId(user.id) }, {
                is_active: user.isActive,
                subscription: {
                    id: user.subscription.id,
                    plan: user.subscription.plan,
                },
            });
        });
    }
    updateRemainingSeconds(userId, seconds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ _id: new mongoose_1.Types.ObjectId(userId) }, {
                remaining_seconds: seconds,
            });
        });
    }
    documentToEntity(document) {
        return {
            id: document._id.toString(),
            name: document.name,
            email: document.email,
            picture: document.picture,
            isActive: document.is_active,
            oauth: {
                googleId: document.oauth.google_id,
            },
            subscription: {
                id: document.subscription.id,
                plan: document.subscription.plan,
            },
            remainingSeconds: document.remaining_seconds,
            lastVisit: document.last_visit,
            createdAt: document.created_at,
            updatedAt: document.updated_at,
        };
    }
};
exports.UserRepositoryImpl = UserRepositoryImpl;
exports.UserRepositoryImpl = UserRepositoryImpl = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_2.InjectModel)(schema_1.Collections.User)),
    tslib_1.__metadata("design:paramtypes", [mongoose_1.Model])
], UserRepositoryImpl);
