"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const guard_1 = require("../../guard");
const create_link_1 = require("../../../usecases/checkout/create-link");
const jsonwebtoken_1 = require("jsonwebtoken");
const domain_1 = require("../../../../domain");
let CheckoutController = class CheckoutController {
    constructor(checkoutCreateLinkUseCase) {
        this.checkoutCreateLinkUseCase = checkoutCreateLinkUseCase;
    }
    createCheckoutLinkStarter(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { userId, email, name } = (0, jsonwebtoken_1.decode)(request.header("Token"));
            const checkoutUrl = yield this.checkoutCreateLinkUseCase.execute({
                store: {
                    id: domain_1.PaymentProcessorSubscription.Store.Id,
                },
                product: {
                    id: domain_1.PaymentProcessorSubscription.Product.Id.Plus,
                },
                customer: {
                    email: email,
                    name: name,
                },
            }, {
                userId: userId,
                plan: domain_1.UserSubscriptionPlan.PLUS,
            });
            response.status(common_1.HttpStatus.OK).json({ checkout_url: checkoutUrl });
        });
    }
};
exports.CheckoutController = CheckoutController;
tslib_1.__decorate([
    (0, common_1.Post)("/create-link/plus"),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CheckoutController.prototype, "createCheckoutLinkStarter", null);
exports.CheckoutController = CheckoutController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guard_1.AuthGuard),
    (0, common_1.Controller)("checkout"),
    tslib_1.__metadata("design:paramtypes", [create_link_1.CheckoutCreateLinkUseCase])
], CheckoutController);
