import { User, UserSubscriptionPlan } from "app/domain";

export interface UserRepository {
    create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<void>;

    getByGoogleId(id: string): Promise<User>;

    updatePlan(user: {
        id: string;
        isActive: boolean;
        subscription: {
            id: string | null;
            plan: UserSubscriptionPlan;
        };
    }): Promise<void>;

    getById(id: string): Promise<User>;

    updateStatus(userId: string, status: { active: boolean }): Promise<void>;
}
