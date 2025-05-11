import {Controller, Get, Inject, Post, Req, Res, UseGuards} from "@nestjs/common";
import {UserAuthenticateUseCase} from "app/application/usecases/user/authenticate";
import {AuthGuard as APIAuthGuard} from "app/application/api/guard";
import {Response, Request} from "express";
import {decode, JwtPayload} from "jsonwebtoken";
import {UserGetProfile} from "app/application/usecases/user/get-profile";
import {AuthGuard} from "@nestjs/passport";
import {Application} from "app/common";
import {UserCheckTrialUseCase} from "app/application/usecases/user/check-trial";
import {UserUpdateStatusUseCase} from "app/application/usecases/user/update-status/usecase";

type AuthenticatedRequest = Request & {
    user: {
        id: string;
        _json: { name?: string; email?: string; email_verified?: boolean; picture: string };
    };
};

@Controller("user")
export class UserController {
    constructor(
        private readonly userAuthenticateUseCase: UserAuthenticateUseCase,
        private readonly userGetProfile: UserGetProfile,
        @Inject(Application.UseCase.UserCheckTrial)
        private readonly userCheckTrialUseCase: UserCheckTrialUseCase,
        @Inject(Application.UseCase.UserUpdateStatus)
        private readonly userUpdateStatusUseCase: UserUpdateStatusUseCase
    ) {
    }

    @Get("google")
    @UseGuards(AuthGuard("google"))
    async googleAuth() {
    }

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    async googleAuthCallback(
        @Req() request: AuthenticatedRequest,
        @Res() response: Response,
    ): Promise<void> {
        const user = await this.userAuthenticateUseCase.execute({
            name: request.user._json.name ?? null,
            email: request.user._json.email ?? null,
            googleId: request.user.id,
            picture: request.user._json.picture ?? null,
        });

        const frontendUrl = `${process.env.FRONTEND_URL}?token=${user.token}`;

        response.redirect(frontendUrl);
    }

    @UseGuards(APIAuthGuard)
    @Post("profile")
    async getProfile(@Req() request: Request, @Res() response: Response) {
        const {userId, email, name} = decode(request.header("Token") as string) as JwtPayload;

        const isTrial = await this.userCheckTrialUseCase.execute(userId);

        if (!isTrial) {
            await this.userUpdateStatusUseCase.execute(userId, {active: false});

            response.json({status: "trial expired"});

            return;
        }

        const user = await this.userGetProfile.execute(userId);

        response.status(200).json(user);
    }
}
