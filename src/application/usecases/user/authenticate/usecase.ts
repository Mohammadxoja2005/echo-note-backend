import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { User, UserRepository, UserSubscriptionPlan } from "app/domain";
import { sign } from "jsonwebtoken";

@Injectable()
export class UserAuthenticateUseCase {
    constructor(
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(user: {
        name: string | null;
        email: string | null;
        picture: string | null;
        googleId: string;
    }): Promise<{ user: User; token: string }> {
        try {
            await this.userRepository.create({
                name: user.name,
                email: user.email,
                picture: user.picture,
                isActive: true,
                oauth: {
                    googleId: user.googleId,
                },
                remainingSeconds: 3600,
                lastVisit: new Date(),
                subscription: {
                    id: null,
                    plan: UserSubscriptionPlan.TRIAL,
                },
            });

            const foundUser = await this.userRepository.getByGoogleId(user.googleId);

            const accessToken: string = sign(
                { userId: foundUser.id, email: foundUser.email, name: foundUser.name },
                `${process.env.JWT_SECRET_KEY}`,
            );

            return { user: foundUser, token: accessToken };
        } catch (error) {
            throw new Error("Error in authenticating user", { cause: error });
        }
    }
}
