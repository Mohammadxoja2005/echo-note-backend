import { Module } from "@nestjs/common";
import { MongooseModule as Mongoose } from "@nestjs/mongoose";

@Module({
    imports: [
        Mongoose.forRoot(
            "mongodb+srv://echonote:Muha2005@cluster0.tdrte49.mongodb.net/?appName=Cluster0",
        ),
    ],
})
export class MongooseModule {}
