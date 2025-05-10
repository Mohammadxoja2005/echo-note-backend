import {User} from "app/domain";

export interface UserRepository {
    create(user: User): Promise<void>;

    getByGoogleId(id: string): Promise<User>;

    updatePlan(user: {
        id: string;
    }): Promise<void>;

    getById(id: string): Promise<User>;
}