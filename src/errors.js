export class OperationError extends Error {
    constructor(message, underlying) {
        super(message);
        this.name = "Operation Error";
        this.underlying = underlying;
    }
}

export class FileOperationError extends OperationError { 
    constructor(message, underlying) {
        super(message, underlying);
        this.name = "File Operation Error";
    }
}

export class PathOperationError extends OperationError {
    constructor(message, underlying) {
        super(message, underlying);
        this.name = "Path Operation Error";
    }
 }