"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        dotenv.config();
        const app = yield core_1.NestFactory.create(app_module_1.AppModule, {
            rawBody: true,
        });
        app.enableCors({
            origin: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
            credentials: true,
        });
        yield app.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000, "0.0.0.0").then(() => {
            var _a;
            console.log("process.env.PORT", (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
        });
    });
}
bootstrap();
