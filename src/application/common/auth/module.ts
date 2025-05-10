import {AuthGoogleStrategy} from "app/infrastructure/auth/strategies/google";
import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";

@Module({
    imports: [PassportModule.register({defaultStrategy: "google"})],
    providers: [AuthGoogleStrategy],
})
export class AuthModule {
}
