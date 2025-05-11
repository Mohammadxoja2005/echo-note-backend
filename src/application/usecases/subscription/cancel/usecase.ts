import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { PaymentProcessor, UserRepository } from "app/domain";

@Injectable()
export class SubscriptionCancelUseCase {
    constructor(
        @Inject(Infrastructure.PaymentProcessor.LemonSqueezy)
        private readonly paymentProcessor: PaymentProcessor,
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(userId: string): Promise<void> {
        try {
            const user = await this.userRepository.getById(userId);

            if (user.subscription.id === null) {
                throw new Error("User does not have an active subscription");
            }

            await this.paymentProcessor.cancelSubscription(user.subscription.id);
        } catch (error) {
            throw new Error("Error canceling subscription", { cause: error });
        }
    }
}
