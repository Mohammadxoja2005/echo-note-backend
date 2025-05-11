import { Module } from "@nestjs/common";
import { SubscriptionCancelUseCase } from "app/application/usecases/subscription/cancel";
import { SubscriptionController } from "app/application/api/controller/subscription/controller";
import { Application } from "app/common";
import { UserModule } from "app/application/common/user/module";
import { PaymentProcessorModule } from "app/application/common/payment-processor";
import { SubscriptionActivateUseCase } from "app/application/usecases/subscription/activate";
import { SubscriptionDeactivateUseCase } from "app/application/usecases/subscription/deactivate";
import { WebhookSubscriptionController } from "app/application/webhook/subscription";

@Module({
    imports: [UserModule, PaymentProcessorModule],
    providers: [
        {
            provide: Application.UseCase.SubscriptionCancel,
            useClass: SubscriptionCancelUseCase,
        },
        SubscriptionActivateUseCase,
        SubscriptionDeactivateUseCase,
    ],
    controllers: [SubscriptionController, WebhookSubscriptionController],
    exports: [Application.UseCase.SubscriptionCancel],
})
export class SubscriptionModule {}
