import {Module} from "@nestjs/common";
import {MongooseModule} from "app/application/common/mongoose";
import {MongooseModule as Mongoose} from "@nestjs/mongoose";
import {Collections} from "app/infrastructure/schema";
import {NoteSchema} from "app/infrastructure/mongodb/note/schema";
import {Infrastructure} from "app/common";
import {NoteRepositoryImpl} from "app/infrastructure/mongodb/note/note.impl";

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
        }
    ],
    exports: [Infrastructure.Repository.Note],
})
export class NoteModule {
}