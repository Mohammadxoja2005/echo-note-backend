import {Module} from '@nestjs/common';
import {AsrModule} from "app/application/common/asr";
import {ConverterModule} from "app/application/common/converter";
import {MongooseModule} from "app/application/common/mongoose";

@Module({
    imports: [AsrModule, ConverterModule, MongooseModule],
})
export class AppModule {
}
