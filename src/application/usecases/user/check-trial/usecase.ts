import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { UserRepository, UserSubscriptionPlan } from "app/domain";
import { differenceInDays } from "date-fns";

@Injectable()
export class UserCheckTrialUseCase {
    constructor(
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(userId: string): Promise<{ isActive: boolean; daysLeft: number }> {
        const user = await this.userRepository.getById(userId);

        if (user.subscription.plan === UserSubscriptionPlan.TRIAL) {
            const trialStartDate = new Date(user.createdAt);
            const daysSinceCreation = differenceInDays(new Date(), trialStartDate);

            return { isActive: daysSinceCreation <= 7, daysLeft: daysSinceCreation };
        }

        return { isActive: true, daysLeft: 0 };
    }
}
