import { Controller, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "app/application/api/guard";
import { CheckoutCreateLinkUseCase } from "app/application/usecases/checkout/create-link";
import { JwtPayload, decode } from "jsonwebtoken";
import { Response, Request } from "express";
import { UserSubscriptionPlan, PaymentProcessorSubscription } from "app/domain";

@UseGuards(AuthGuard)
@Controller("checkout")
export class CheckoutController {
    constructor(private readonly checkoutCreateLinkUseCase: CheckoutCreateLinkUseCase) {}

    @Post("/create-link/plus")
    async createCheckoutLinkStarter(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email, name } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.checkoutCreateLinkUseCase.execute(
            {
                store: {
                    id: PaymentProcessorSubscription.Store.Id,
                },
                product: {
                    id: PaymentProcessorSubscription.Product.Id.Plus,
                },
                customer: {
                    email: email,
                    name: name,
                },
            },
            {
                userId: userId,
                plan: UserSubscriptionPlan.PLUS,
            },
        );

        response.status(HttpStatus.OK).json({ checkout_url: checkoutUrl });
    }
}
