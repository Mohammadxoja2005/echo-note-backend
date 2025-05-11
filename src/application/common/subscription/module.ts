import { Module } from "@nestjs/common";
import { SubscriptionCancelUseCase } from "app/application/usecases/subscription/cancel";
import { SubscriptionController } from "app/application/api/controller/subscription/controller";
import { Application } from "app/common";
import { UserModule } from "app/application/common/user/module";
import { PaymentProcessorModule } from "app/application/common/payment-processor";

@Module({
    imports: [UserModule, PaymentProcessorModule],
    providers: [
        {
            provide: Application.UseCase.SubscriptionCancel,
            useClass: SubscriptionCancelUseCase,
        },
    ],
    controllers: [SubscriptionController],
    exports: [Application.UseCase.SubscriptionCancel],
})
export class SubscriptionModule {}
