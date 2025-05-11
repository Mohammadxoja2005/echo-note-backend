import {Controller, Get, Post, Req, Res, UseGuards} from "@nestjs/common";
import {AuthGuard} from "app/application/api/guard";
import {NoteGetAllUseCase} from "app/application/usecases/note/get-all";
import {NoteGetUseCase} from "app/application/usecases/note/get";
import {NoteUpdateTitleAndDescription} from "app/application/usecases/note/update-title-and-description";
import {Request, Response} from "express";
import {decode, JwtPayload} from "jsonwebtoken"

@UseGuards(AuthGuard)
@Controller("note")
export class NoteController {
    constructor(
        private readonly noteGetAllUseCase: NoteGetAllUseCase,
        private readonly noteGetUseCase: NoteGetUseCase,
        private readonly noteUpdateTitleAndDescription: NoteUpdateTitleAndDescription
    ) {
    }

    @Get("get-all/:pageNumber")
    async getAll(@Req() request: Request, @Res() response: Response) {
        const {userId, email, name} = decode(request.header("Token") as string) as JwtPayload;

        const {pageNumber} = request.params;

        const {notes, totalPages} = await this.noteGetAllUseCase.execute(userId, parseInt(pageNumber));

        response.status(200).json({notes: notes, totalPages: totalPages});
    }

    @Post("get/:noteId")
    async get(@Req() request: Request, @Res() response: Response) {
        const {userId, email, name} = decode(request.header("Token") as string) as JwtPayload;

        const {noteId} = request.params;

        const note = await this.noteGetUseCase.execute(noteId, userId);

        response.status(200).json({note: note});
    }

    @Post("update/:noteId")
    async update(@Req() request: Request, @Res() response: Response) {
        const {userId, email, name} = decode(request.header("Token") as string) as JwtPayload;

        const {noteId} = request.params;

        const {title, description} = request.body;

        await this.noteUpdateTitleAndDescription.execute(noteId, userId, title, description);

        response.status(200).json({status: "success"});
    }
}
