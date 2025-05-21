import { Module } from "@nestjs/common";
import { AsrModule } from "app/application/common/asr";
import { ConverterModule } from "app/application/common/converter";
import { MongooseModule } from "app/application/common/mongoose";
import { UserModule } from "app/application/common/user/module";
import { AuthModule } from "app/application/common/auth";
import { NoteModule } from "app/application/common/note";
import { CheckoutModule } from "app/application/common/checkout";
import { PaymentProcessorModule } from "app/application/common/payment-processor";
import { SubscriptionModule } from "app/application/common/subscription";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AsrModule,
        ConverterModule,
        MongooseModule,
        UserModule,
        AuthModule,
        NoteModule,
        CheckoutModule,
        PaymentProcessorModule,
        SubscriptionModule,
    ],
})
export class AppModule {}
