import {Module} from "@nestjs/common";
import {PaymentProcessorLemonSqueezy} from "app/infrastructure/payment-processor/lemon-squeezy";
import {Infrastructure} from "app/common";

@Module({
    providers: [{
        provide: Infrastructure.PaymentProcessor.LemonSqueezy,
        useClass: PaymentProcessorLemonSqueezy
    }],
    exports: [Infrastructure.PaymentProcessor.LemonSqueezy]
})
export class PaymentProcessorModule {

}