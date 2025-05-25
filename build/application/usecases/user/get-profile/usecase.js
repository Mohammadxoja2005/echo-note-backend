"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGetProfile = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
let UserGetProfile = class UserGetProfile {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getById(userId);
            }
            catch (error) {
                throw new Error("Error in getting user profile", { cause: error });
            }
        });
    }
};
exports.UserGetProfile = UserGetProfile;
exports.UserGetProfile = UserGetProfile = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Infrastructure.Repository.User)),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserGetProfile);
