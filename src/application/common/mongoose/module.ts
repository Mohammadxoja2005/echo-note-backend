import { Module } from "@nestjs/common";
import { MongooseModule as Mongoose } from "@nestjs/mongoose";

@Module({
    imports: [
        Mongoose.forRoot(
            "mongodb+srv://echonote:Muha2005@cluster0.rmixi.mongodb.net/echo_note?retryWrites=true&w=majority&appName=Cluster0",
        ),
    ],
})
export class MongooseModule {}
