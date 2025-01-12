import { HttpStatus, PresentationError } from "@presentation/protocols";

export class ExistsEntityError extends Error implements PresentationError {
    constructor(public message: string, public statusCode: HttpStatus) {
        super(message);
    }
}
