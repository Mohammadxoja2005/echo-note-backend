import {Module} from "@nestjs/common";
import {MongooseModule} from "app/application/common/mongoose";
import {UserRepositoryImpl} from "app/infrastructure/mongodb/user";
import {Infrastructure} from "app/common";
import {MongooseModule as Mongoose} from "@nestjs/mongoose";
import {Collections} from "app/infrastructure/schema";
import {UserSchema} from "app/infrastructure/mongodb/user/schema";

@Module({
    imports: [
        MongooseModule,
        Mongoose.forFeature([
            {
                name: Collections.User,
                schema: UserSchema,
            },
        ]),
    ],
    providers: [
        {
            provide: Infrastructure.Repository.User,
            useClass: UserRepositoryImpl,
        },
    ],
    exports: [Infrastructure.Repository.User],
})
export class UserModule {
}
