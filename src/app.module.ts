import {Module} from '@nestjs/common';
import {AsrModule} from "app/application/common/asr";
import {ConverterModule} from "app/application/common/converter";
import {MongooseModule} from "app/application/common/mongoose";
import {UserModule} from "app/application/common/user/module";
import {AuthModule} from "app/application/common/auth";

@Module({
    imports: [AsrModule, ConverterModule, MongooseModule, UserModule, AuthModule],
})
export class AppModule {
}
