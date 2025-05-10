import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UserAuthenticateUseCase } from "app/application/usecases/user/authenticate";
import { AuthGuard as APIAuthGuard } from "app/application/api/guard";
import { Response, Request } from "express";
import { decode, JwtPayload } from "jsonwebtoken";
import { UserGetProfile } from "app/application/usecases/user/get-profile";
import { AuthGuard } from "@nestjs/passport";

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
    ) {}

    @Get("google")
    @UseGuards(AuthGuard("google"))
    async googleAuth() {}

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
        const { userId } = decode(request.header("Token") as string) as JwtPayload;

        const user = await this.userGetProfile.execute(userId);

        response.status(200).json(user);
    }
}
