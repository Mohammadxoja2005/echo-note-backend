import { Injectable } from "@nestjs/common";
import { Note, NoteRepository } from "app/domain";
import { InjectModel } from "@nestjs/mongoose";
import { Collections } from "app/infrastructure/schema";
import { Model, Types } from "mongoose";
import { NoteDocument, NoteHydratedDocument } from "app/infrastructure/mongodb/note/document";
import { NoteStatus } from "app/domain/note/types";

@Injectable()
export class NoteRepositoryImpl implements NoteRepository {
    constructor(
        @InjectModel(Collections.Note)
        private readonly model: Model<NoteHydratedDocument>,
    ) {}

    public async create(note: Note): Promise<Note> {
        const document = await this.model.create({
            title: note.title,
            description: note.description,
            user_id: new Types.ObjectId(note.userId),
            status: note.status,
        });

        return this.documentToEntity(document);
    }

    public async getById(id: string, userId: string): Promise<Note> {
        const document = await this.model.findOne<NoteHydratedDocument>({
            _id: id,
            user_id: userId,
        });

        if (!document) {
            throw new Error("Note not found");
        }

        return this.documentToEntity(document);
    }

    public async getAll(userId: string, page = 1): Promise<{ notes: Note[]; totalPages: number }> {
        const limit = 10;
        const skip = (page - 1) * limit;

        const [documents, totalCount] = await Promise.all([
            this.model
                .find<NoteHydratedDocument>({
                    user_id: new Types.ObjectId(userId),
                })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),

            this.model.countDocuments({
                user_id: new Types.ObjectId(userId),
            }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            notes: documents.map((doc) => this.documentToEntity(doc)),
            totalPages,
        };
    }

    public async updateTitleAndDescription(
        id: string,
        userId: string,
        title: string,
        description: string,
        summarizedText: string,
    ): Promise<void> {
        await this.model.updateOne(
            {
                _id: new Types.ObjectId(id),
                user_id: new Types.ObjectId(userId),
            },
            {
                title: title,
                description: description,
                status: NoteStatus.done,
                summerized_text: summarizedText,
            },
        );
    }

    private documentToEntity(document: NoteDocument): Note {
        return {
            id: document._id.toString(),
            title: document.title,
            description: document.description,
            userId: document.user_id.toString(),
            status: document.status,
            createdAt: document.created_at,
            updatedAt: document.updated_at,
        };
    }
}
