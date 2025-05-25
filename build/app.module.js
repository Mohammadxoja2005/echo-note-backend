"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const asr_1 = require("./application/common/asr");
const converter_1 = require("./application/common/converter");
const mongoose_1 = require("./application/common/mongoose");
const module_1 = require("./application/common/user/module");
const auth_1 = require("./application/common/auth");
const note_1 = require("./application/common/note");
const checkout_1 = require("./application/common/checkout");
const payment_processor_1 = require("./application/common/payment-processor");
const subscription_1 = require("./application/common/subscription");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            asr_1.AsrModule,
            converter_1.ConverterModule,
            mongoose_1.MongooseModule,
            module_1.UserModule,
            auth_1.AuthModule,
            note_1.NoteModule,
            checkout_1.CheckoutModule,
            payment_processor_1.PaymentProcessorModule,
            subscription_1.SubscriptionModule,
        ],
    })
], AppModule);
