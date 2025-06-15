import { Injectable, NotFoundException } from "@nestjs/common";
import { User, UserRepository, UserSubscriptionPlan } from "app/domain";
import { Model, Types } from "mongoose";
import { Collections } from "app/infrastructure/schema";
import { UserCreateDocument, UserDocument, UserHydratedDocument } from "./document";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UserRepositoryImpl implements UserRepository {
    constructor(
        @InjectModel(Collections.User)
        private readonly model: Model<UserHydratedDocument>,
    ) {}

    public async create(user: User): Promise<User> {
        const isEmailUserExists = await this.model.findOne<UserDocument>({
            email: user.email,
        });

        if (isEmailUserExists) {
            return this.documentToEntity(isEmailUserExists);
        }

        const document = await this.model.create<UserCreateDocument>({
            name: user.name,
            email: user.email,
            is_active: user.isActive,
            picture: user.picture,
            oauth: {
                google_id: user.oauth.googleId,
            },
            remaining_seconds: user.remainingSeconds,
            last_visit: user.lastVisit,
            subscription: {
                id: null,
                plan: user.subscription.plan,
            },
        });

        return this.documentToEntity(document);
    }

    public async getByGoogleId(id: string): Promise<User> {
        const document = await this.model.findOne<UserDocument>({ "oauth.google_id": id });

        if (!document) {
            throw new NotFoundException("User not found");
        }

        return this.documentToEntity(document);
    }

    public async getById(id: string): Promise<User> {
        const document = await this.model.findOne({ _id: new Types.ObjectId(id) });

        if (!document) {
            throw new Error("User not found");
        }

        return this.documentToEntity(document);
    }

    public async updateStatus(userId: string, status: { active: boolean }): Promise<void> {
        await this.model.updateOne(
            { _id: new Types.ObjectId(userId) },
            {
                is_active: status.active,
            },
        );
    }

    public async updatePlan(user: {
        id: string;
        isActive: boolean;
        subscription: { id: string; plan: UserSubscriptionPlan };
    }): Promise<void> {
        await this.model.updateOne(
            { _id: new Types.ObjectId(user.id) },
            {
                is_active: user.isActive,
                subscription: {
                    id: user.subscription.id,
                    plan: user.subscription.plan,
                },
            },
        );
    }

    public async updateRemainingSeconds(userId: string, seconds: number): Promise<void> {
        await this.model.updateOne(
            { _id: new Types.ObjectId(userId) },
            {
                remaining_seconds: seconds,
            },
        );
    }

    private documentToEntity(document: UserDocument): User {
        return {
            id: document._id.toString(),
            name: document.name,
            email: document.email,
            picture: document.picture,
            isActive: document.is_active,
            oauth: {
                googleId: document.oauth.google_id,
            },
            subscription: {
                id: document.subscription.id,
                plan: document.subscription.plan,
            },
            remainingSeconds: document.remaining_seconds,
            lastVisit: document.last_visit,
            createdAt: document.created_at,
            updatedAt: document.updated_at,
        };
    }
}
