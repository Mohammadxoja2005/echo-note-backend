import {Module} from "@nestjs/common";
import {MongooseModule} from "app/application/common/mongoose";
import {UserRepositoryImpl} from "app/infrastructure/mongodb/user";
import {Application, Infrastructure} from "app/common";
import {MongooseModule as Mongoose} from "@nestjs/mongoose";
import {Collections} from "app/infrastructure/schema";
import {UserSchema} from "app/infrastructure/mongodb/user/schema";
import {UserController} from "app/application/api/controller/user";
import {UserGetProfile} from "app/application/usecases/user/get-profile";
import {UserAuthenticateUseCase} from "app/application/usecases/user/authenticate";
import {AuthModule} from "app/application/common/auth";
import {UserCheckTrialUseCase} from "app/application/usecases/user/check-trial";
import {UserUpdateStatusUseCase} from "app/application/usecases/user/update-status/usecase";

@Module({
    imports: [
        AuthModule,
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
        {
            provide: Application.UseCase.UserCheckTrial,
            useClass: UserCheckTrialUseCase
        },
        {
            provide: Application.UseCase.UserUpdateStatus,
            useClass: UserUpdateStatusUseCase,
        },
        UserGetProfile,
        UserAuthenticateUseCase,
    ],
    controllers: [UserController],
    exports: [
        Infrastructure.Repository.User,
        Application.UseCase.UserCheckTrial,
        Application.UseCase.UserUpdateStatus
    ],
})
export class UserModule {
}
