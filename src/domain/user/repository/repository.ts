import {User} from "app/domain";

export interface UserRepository {
    create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<void>;

    getByGoogleId(id: string): Promise<User>;

    updatePlan(user: {
        id: string;
    }): Promise<void>;

    getById(id: string): Promise<User>;

    updateStatus(userId: string, status: { active: boolean }): Promise<void>
}