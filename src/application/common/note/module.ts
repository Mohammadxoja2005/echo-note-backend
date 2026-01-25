import { Module } from "@nestjs/common";
import { MongooseModule } from "app/application/common/mongoose";
import { MongooseModule as Mongoose } from "@nestjs/mongoose";
import { Collections } from "app/infrastructure/schema";
import { NoteSchema } from "app/infrastructure/mongodb/note/schema";
import { Infrastructure } from "app/common";
import { NoteRepositoryImpl } from "app/infrastructure/mongodb/note/note.impl";
import { NoteGetAllUseCase } from "app/application/usecases/note/get-all";
import { NoteGetUseCase } from "app/application/usecases/note/get";
import { NoteUpdateTitleAndDescription } from "app/application/usecases/note/update-title-and-description";
import { NoteController } from "app/application/api/controller/note";

@Module({
    imports: [
        MongooseModule,
        Mongoose.forFeature([
            {
                name: Collections.Note,
                schema: NoteSchema,
            },
        ]),
    ],
    providers: [
        {
            provide: Infrastructure.Repository.Note,
            useClass: NoteRepositoryImpl,
        },
        NoteGetAllUseCase,
        NoteGetUseCase,
        NoteUpdateTitleAndDescription,
    ],
    controllers: [NoteController],
    exports: [Infrastructure.Repository.Note],
})
export class NoteModule {}
