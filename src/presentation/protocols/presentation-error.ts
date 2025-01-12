import { HttpStatus } from ".";

export interface PresentationError {
    message: string;
    name: string;
    statusCode: HttpStatus;
}
