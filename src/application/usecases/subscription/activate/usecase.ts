import { Inject, Injectable } from "@nestjs/common";
import { UserSubscriptionPlan, UserRepository } from "app/domain";
import { Infrastructure } from "app/common";

@Injectable()
export class SubscriptionActivateUseCase {
    constructor(
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(user: {
        id: string;
        isActive: boolean;
        subscription: { id: string; plan: UserSubscriptionPlan };
    }): Promise<void> {
        const foundUser = await this.userRepository.getById(user.id);

        if (!foundUser) {
            throw new Error("User not found");
        }

        if (user.subscription.plan === UserSubscriptionPlan.PLUS) {
            await this.updatePlanToPlus(user);
        }
    }

    private async updatePlanToPlus(user: {
        id: string;
        isActive: boolean;
        subscription: { id: string; plan: UserSubscriptionPlan };
    }): Promise<void> {
        await this.userRepository.updatePlan({
            id: user.id,
            isActive: user.isActive,
            subscription: user.subscription,
        });
    }
}
