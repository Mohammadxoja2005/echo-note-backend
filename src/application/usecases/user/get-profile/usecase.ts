import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { User, UserRepository } from "app/domain";

@Injectable()
export class UserGetProfile {
    constructor(
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(userId: string): Promise<User> {
        try {
            return await this.userRepository.getById(userId);
        } catch (error) {
            throw new Error("Error in getting user profile", { cause: error });
        }
    }
}
