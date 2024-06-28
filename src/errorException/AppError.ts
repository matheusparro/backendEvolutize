// AppError.ts
export default class AppError extends Error {
    statusCode: number;
    code: string;

    constructor(statusCode: number, message: string, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
