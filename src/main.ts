import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule, {
        rawBody: true,
    });

    app.enableCors({
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000, "0.0.0.0").then(() => {
        console.log("process.env.PORT", process.env.PORT ?? 3000);
    });
}

bootstrap();
