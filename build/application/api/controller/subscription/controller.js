"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common");
const guard_1 = require("../../guard");
const cancel_1 = require("../../../usecases/subscription/cancel");
const jsonwebtoken_1 = require("jsonwebtoken");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionCancelUseCase) {
        this.subscriptionCancelUseCase = subscriptionCancelUseCase;
    }
    cancel(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { userId } = (0, jsonwebtoken_1.decode)(request.header("Token"));
            yield this.subscriptionCancelUseCase.execute(userId);
            response.status(common_1.HttpStatus.OK).json("Subscription canceled successfully");
        });
    }
};
exports.SubscriptionController = SubscriptionController;
tslib_1.__decorate([
    (0, common_1.Post)("cancel"),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SubscriptionController.prototype, "cancel", null);
exports.SubscriptionController = SubscriptionController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guard_1.AuthGuard),
    (0, common_1.Controller)("subscription"),
    tslib_1.__param(0, (0, common_1.Inject)(common_2.Application.UseCase.SubscriptionCancel)),
    tslib_1.__metadata("design:paramtypes", [cancel_1.SubscriptionCancelUseCase])
], SubscriptionController);
