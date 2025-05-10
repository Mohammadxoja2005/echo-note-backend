import {Inject, Injectable} from "@nestjs/common";
import {Infrastructure} from "app/common";
import {UserRepository} from "app/domain";

@Injectable()
export class UserUpdateStatusUseCase {
    constructor(
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository) {
    }

    public async execute(userId: string, status: { active: boolean }): Promise<void> {
        await this.userRepository.updateStatus(userId, {active: status.active})
    }
}