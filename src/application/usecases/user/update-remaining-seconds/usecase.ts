import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { UserRepository, UserSubscriptionPlan } from "app/domain";

@Injectable()
export class UserUpdateRemainingSecondsUseCase {
    constructor(
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(userId: string): Promise<void> {
        try {
            const now = new Date();
            const todayStr = now.toISOString().slice(0, 10);

            const user = await this.userRepository.getById(userId);

            const lastVisitStr = user.lastVisit.toISOString().slice(0, 10);

            if (
                lastVisitStr !== todayStr &&
                user.subscription.plan !== UserSubscriptionPlan.TRIAL
            ) {
                await this.userRepository.updateRemainingSeconds(userId, 3600, now);
            }
        } catch (error) {
            throw new Error("Error updating remaining seconds", { cause: error });
        }
    }
}
