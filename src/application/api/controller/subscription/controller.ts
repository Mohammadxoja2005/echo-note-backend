import { Controller, HttpStatus, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { Application } from "app/common";
import { AuthGuard } from "app/application/api/guard";
import { SubscriptionCancelUseCase } from "app/application/usecases/subscription/cancel";
import { decode, JwtPayload } from "jsonwebtoken";

@UseGuards(AuthGuard)
@Controller("subscription")
export class SubscriptionController {
    constructor(
        @Inject(Application.UseCase.SubscriptionCancel)
        private readonly subscriptionCancelUseCase: SubscriptionCancelUseCase,
    ) {}

    @Post("cancel")
    async cancel(@Req() request: Request, @Res() response: Response): Promise<void> {
        const { userId } = decode(request.header("Token") as string) as JwtPayload;

        await this.subscriptionCancelUseCase.execute(userId);

        response.status(HttpStatus.OK).json("Subscription canceled successfully");
    }
}
